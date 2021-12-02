$(document).ready(function() {
    new employeePage;
})

class employeePage {
    FormMode = null;
    idSelected = null;
    nameSelected = null;
    currentPageIndex = 1;
    maxPageIndexButton = 5;
    constructor() {
        this.maxPageIndexButton = 5;
        this.currentPageIndex = 1;
        // Load dữ liệu:
        this.loadDataFilter();
        
        // Khởi tạo sự kiện:
        this.initEvent();
    }

    /**
     * Hàm khởi tạo các sự kiện
     * Author: NPTAN (28/11/2021)
     * Version: 1
     */
    initEvent() {

        // Reload data table:
        $('#t-top-content .t-load-btn').click(this.reloadTableData.bind(this));

        // Mở popup thêm mới nhân viên:
        $('#t-content .t-btn-add').click(this.openPopup.bind(this));    // Click nút thêm mới nhân viên
        $('#t-overlay .t-close-icon').click(this.closePopup);
        $('#t-overlay .t-popup-cancel').click(this.closePopup);
        $('#t-overlay .t-save-only').click(this.closePopup);

        // Click nút cất dữ liệu của nhân viên:
        $('#t-overlay .t-save-and-add').click(this.addEmployee.bind(this));
        
        // Click sửa thông tin nhân viên:
        $('#t-content .t-employee-function .t-function-name').on('click', this.changeData.bind(this));

        // Sự kiện click vào mũi tên trên hộp chức năng:
        $('#t-table-content .t-function-extend').click(this.openFunctionBox);
        
        // Click vào nút xóa bản ghi:
        $('#t-table-content .t-function-remove').on('click', this.openDialogWarning.bind(this));
        $('#t-dialog .t-dialog-cancel').click(this.closeDialogWarning);
        $('#t-dialog .t-dialog-agree').click(this.delete.bind(this));

        // Click chọn giới tính:
        $('.t-select-gender input').on('click', this.handleRadioGender);

        // Click ẩn thông báo trùng mã nhân viên:
        $('#t-dialog-check-code .t-btn-agree-check').click(this.closeWarningCode);

        // Tìm kiếm nhân viên theo họ và tên:
        // Nhập từ khóa muốn tìm kiếm:
        // $('#t-input-text').on('blur', this.searchEmployee.bind(this));

        // Nhấn icon tìm kiếm:
        $('.t-input-filter .t-icon-search').click(this.searchEmployee.bind(this));

        // Focus vào input tìm kiếm và nhấn enter để tìm kiếm:
        $('.t-input-filter #t-input-text').keyup(this.enterSearchText.bind(this));

        // Click chuyển trang:
        // 1. Click chuyển tới trang trước đó:
        $('#t-content-footer .t-pre-page').click(this.selectPrevPage.bind(this));
        // 2. Click chuyển tới trang tiếp theo:
        $('#t-content-footer .t-next-page').click(this.selectNextPage.bind(this));
        
        // Hiển thị số bản ghi/trang:
        $('#t-content-footer #t-combobox-number').change(this.showRecord.bind(this));
    }

    /**
     * Khởi tạo sự kiện cho các phần tử được render sau:
     * Author: NPTAN (01/12/2021)
     * Version: 1
     */
    initEventRenderElement() {
        // Click sửa thông tin nhân viên:
        $('#t-content .t-employee-function .t-function-name').on('click', this.changeData.bind(this));

        // Sự kiện click vào nút sửa trên bản ghi (Hộp chức năng):
        $('#t-table-content .t-function-extend').click(this.openFunctionBox);

        // Click vào nút xóa bản ghi:
        $('#t-table-content .t-function-remove').on('click', this.openDialogWarning.bind(this));
        $('#t-dialog .t-dialog-cancel').click(this.closeDialogWarning);
        $('#t-dialog .t-dialog-agree').click(this.delete.bind(this));
    }

    // Hiển thị số bản ghi/trang:
    showRecord(sender) {
        let me = this;
        me.currentPageIndex = 1;
        me.loadDataFilter(me.currentPageIndex);
        me.initEventRenderElement();
    }

    // Quay lại trang trước đó:
    selectPrevPage(sender) {
        let me = this;
        // Chuyển focus sang button số của trang tương ứng:
        // Xác định button của trang hiện tại, xóa class avtive của nó:
        let currentPage = $(sender.target).siblings('.t-list-page').children().filter('.t-page-active');
        $(currentPage).removeClass('t-page-active');
        // Xác định button tiếp theo, thêm class active cho nó:
        let prevPage = $(currentPage).prev();
        $(prevPage).addClass('t-page-active');

        // Lấy ra giá trị của button:
        let value = $(prevPage).data('value');
        me.currentPageIndex = value;
        me.loadDataFilter(value);
    }

    // Chuyển tới trang tiếp theo:
    selectNextPage(sender) {
        let me = this;
        // Chuyển focus sang button số của trang tương ứng:
        // Xác định button của trang hiện tại, xóa class avtive của nó:
        let currentPage = $(sender.target).siblings('.t-list-page').children().filter('.t-page-active');
        $(currentPage).removeClass('t-page-active');
        // Xác định button tiếp theo, thêm class active cho nó:
        let nextPage = $(currentPage).next();
        $(nextPage).addClass('t-page-active');

        // Lấy ra giá trị của button:
        let value = $(nextPage).data('value');
        me.currentPageIndex = value;
        me.loadDataFilter(value);
    }

    // Tìm kiếm theo họ và tên:
    searchEmployee(sender) {
        let me = this;
        me.currentPageIndex = 1;
        let inputSearch = sender.target;    // Lấy ra thẻ input hiện tại
        this.currentPageIndex = 1;  // Sau mỗi lần tìm kiếm, set lại trang hiện tại là trang 1
        this.loadDataFilter(me.currentPageIndex);
        this.initEventRenderElement();
    }

    // Ấn enter để tìm kiếm:
    enterSearchText(e) {
        let me = this;
        if(e.keyCode == 13) {
            me.currentPageIndex = 1;
            this.currentPageIndex = 1;  // Sau mỗi lần tìm kiếm, set lại trang hiện tại là trang 1
            this.loadDataFilter(me.currentPageIndex);
            this.initEventRenderElement();
        }
    }

    // Mở/Đóng hộp chức năng:
    openFunctionBox(e) {
        // Mở hộp chức năng:
        $(e.target).children().fadeToggle(300);
    }

    // Mở/Đóng popup thêm mới nhân viên:
    openPopup(e) {
        // Reset tất cả các input
        let inputs = $('#t-overlay .t-popup-content input');
        for (const input of inputs) {
            if($(input).attr('type') != 'radio') {
                $(input).val(null);
            }
        }
        
        let me = this;
        me.FormMode = Enum.FormMode.Add;
        $('#t-overlay').fadeIn(300);

        // Auto tạo mã nhân viên mới:
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
            // async: false,
            success: function (response) {
                if(response) {
                    const employeeCode = response;
                    $('.t-code-info input').val(employeeCode).focus();
                }
            },
            error: function(reject) {
                alert('Tạo mã nhân viên không thành công!');
            }
        });
    }

    closePopup(e) {
        $('#t-overlay').fadeOut(300);
    }

    // Mở/Đóng dialog warning:
    openDialogWarning(sender) {
        $('#t-dialog').fadeIn(300);

        // Lấy ra id và họ và tên của bản ghi:
        let currentRecord = $(sender.target).parents('.t-row-table');
        let employeeId = currentRecord.data('employeeId');
        let code = $(currentRecord).children('.t-employee-code').text();
        this.idSelected = employeeId;
        // this.nameSelected = fullName;

        // Build dữ liệu cho dialog:
        $('#t-name-remove').text(`<${code}>`);

        // Đóng hộp chức năng:
        $('#t-table .t-function-box').hide();
    }

    closeDialogWarning() {
        $('#t-dialog').fadeOut(300);
    }

    // Click btn reload dữ liệu của table:
    reloadTableData(sender) {
        let me = this;
        this.loadDataFilter();
        me.initEventRenderElement();
    }

    // Click ẩn thông báo trùng mã nhân viên:
    closeWarningCode() {
        $('#t-dialog-check-code').fadeOut(300);
    }

    /**
     * Thêm mới nhân viên
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    addEmployee(sender) {

        // Kiểm tra các trường bắt buộc đã được nhập hay chưa:
        let check = InputElement.checkInput();

        if(check) {
            let me = this;
            let employee = {};
            // Lấy ra tất cả các input trong popup:
            let inputs = $('#t-popup .t-popup-content .t-input-info');
            // Duyệt, lấy ra các value:
            for (const input of inputs) {
                let fieldName = $(input).attr('fieldName');
                let value = $(input).val();
                if(fieldName != '' && value) {
                    // Build object employee:
                    employee[fieldName] = value;
                }
            }
    
            // Duyệt các combobox
            // Lấy ra value hiện tại
            let comboboxs = $('#t-popup div[tcombobox]');
            for (const combobox of comboboxs) {
                let fieldName = $(combobox).data('fieldName');
                let value = $(combobox).attr('value');
                if(fieldName != '') {
                    // Build vào object hiện tại
                    employee[fieldName] = value;
                }
            }

            // Gọi đến api cất dữ liệu:
            if(me.FormMode == Enum.FormMode.Add) {
                $.ajax({
                    type: "POST",
                    url: "http://amis.manhnv.net/api/v1/Employees",
                    // async: false,
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        // Load lại dữ liệu:
                        me.loadDataFilter();
                        me.initEventRenderElement();

                        // Ẩn popup:
                        $('#t-overlay').fadeOut(300);
                    },
                    error: function(reject) {
                        // Hiển thị employee code bị trùng:
                        $('#t-dialog-check-code #t-code-warning').text(`<${employee['EmployeeCode']}>`);
                        // Hiện lên thông báo trùng mã nhân viên:
                        $('#t-dialog-check-code').fadeIn(200);
                    }
                });
            }
            else {
                $.ajax({
                    type: "PUT",
                    url: `http://amis.manhnv.net/api/v1/Employees/${me.idSelected}`,
                    // async: false,
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        // Load lại dữ liệu
                        me.loadDataFilter()
                        me.initEventRenderElement();
                        // Ẩn popup
                        $('#t-overlay').fadeOut(300);
                    },
                    error: function(reject) {
                        // Hiển thị employee code bị trùng:
                        $('#t-dialog-check-code #t-code-warning').text(`<${employee['EmployeeCode']}>`);
                        // Hiện lên thông báo trùng mã nhân viên:
                        $('#t-dialog-check-code').fadeIn(200);
                    }
                });
            }
        }
       
    }

    /**
     * Sửa thông tin nhân viên
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    changeData(sender) {
        let me = this;

        // Lấy ra employeeId (khóa chính) của bản ghi hiện tại:
        let currentRow = $(sender.target).parents('.t-row-table');
        let employeeId = $(currentRow).data('employeeId');

        // Lưu lại trạng thái:
        me.FormMode = Enum.FormMode.Update;
        // Lưu lại id của bản ghi đã được chọn:
        me.idSelected = employeeId;

        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
            async: false,
            success: function (employee) {
                // Bind dữ liệu vào form:
                // Lấy toàn bộ các thẻ input info:
                let inputs = $('#t-popup .t-popup-content .t-input-info[fieldName]');
                // Duyệt các input, lấy ra các fieldName để biết được sẽ map với thông tin nào của đối tượng:
                for (const input of inputs) {
                    let fieldName = $(input).attr('fieldName');
                    let value = employee[fieldName];
                    if(value) {
                        $(input).val(value);
                    }
                    else {
                        $(input).val(null);
                    }
                }

                // Hiển thị popup:
                $('#t-overlay').fadeIn(300);
                // Auto focus vào mã nhân viên:
                $('.t-code-info input').focus();
            }
        });

    }

    /**
     * Xóa bản ghi
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    delete(sender) {
        let me = this;
        // Lấy ra id của bản ghi:
        // let employeeId = $(sender.target).parents('.t-row-table').data('employeeId');
        // Gọi đến api xóa bản ghi:
        $.ajax({
            type: "DELETE",
            url: `http://amis.manhnv.net/api/v1/Employees/${me.idSelected}`,
            async: false,
            success: function (response) {
                me.loadDataFilter();
                me.closeDialogWarning();
            }
        });
        me.initEventRenderElement();
    }

    /**
     * Xử lý radio gender input
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    handleRadioGender(e) {
        // Gán value cho div select gender
        let currentInput = e.target;
        let parentInput = $(currentInput).parents('.t-select-gender');
        let value = $(currentInput).val();
        parentInput.val(value);
    }

    /**
     * Hàm load dữ liệu từ API đã được lọc theo input
     * Author: NPTAN (30/11/2021)
     * Version: 1
     */
    loadDataFilter(pageNumber) {
        let me = this;
        // Clear dữ liệu cũ:
        $('#t-table tbody').empty();
        // Hiện icon loading
        $('#t-load-overlay').show();

        // Lấy các thông tin thực hiện phân trang:
        let searchText = $('#t-input-text').val();
        const pageSize = $('#t-combobox-number').val();    // Số bản ghi/trang
        if( !pageNumber ) {
            pageNumber = 1;
        }
        searchText = (searchText ? searchText : '');
        let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${searchText}`;

        let data = [];
        // Gọi đến api để lấy dữ liệu:
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            success: function (response) {
                if(response) {
                    data = response;
                    let employees = response;
                    // Duyệt từng từng nhân viên có trong mảng:
                    for (const employee of employees.Data) {
                        // Build các tr và append vào table:
                        let tr = $(`<tr class="t-row-table">
                            <td class="t-checkbox t-col-border t-padding-10"> <input type="checkbox" name="" id=""> </td>
                            <td class="t-employee-code t-col-border t-padding-10">${employee.EmployeeCode || ''}</td>
                            <td class="t-employee-name t-col-border t-padding-10">${employee.EmployeeName || ''}</td>
                            <td class="t-employee-gender t-col-border t-padding-10 t-align-center">${employee.GenderName || ''}</td>
                            <td class="t-employee-date t-col-border t-padding-10 t-align-center">${CommnonJS.formatDateDDMMYYYY(employee.DateOfBirth) || ''}</td>
                            <td class="t-employee-cmnd t-col-border t-padding-10">${employee.IdentityNumber || ''}</td>
                            <td class="t-employee-position t-col-border t-padding-10">${employee.EmployeePosition || ''}</td>
                            <td class="t-employee-unit t-col-border t-padding-10">${employee.DepartmentName || ''}</td>
                            <td class="t-employee-account-number t-col-border t-padding-10">${employee.BankAccountNumber || ''}</td>
                            <td class="t-employee-bank t-col-border t-padding-10">${employee.BankName || ''}</td>
                            <td class="t-employee-branch t-col-border t-padding-10">${employee.BankBranchName || ''}</td>
                            <td class="t-employee-function t-border-bottom t-padding-10 t-align-center">
                                <div class="t-function-btn">
                                    <div class="t-function-name t-mg-right-4">Sửa</div>
                                    <div class="t-function-extend">
                                        <div class="t-function-box">
                                            <div class="t-box-item">Nhân bản</div>
                                            <div class="t-box-item t-function-remove">Xóa</div>
                                            <div class="t-box-item">Ngừng sử dụng</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>`);

                        // Lưu trữ khóa chính của mỗi row của table
                        tr.data('employeeId', employee.EmployeeId);
                        tr.data('data', employee);
                        $('#t-table tbody').append(tr);
                    }
                    
                    // Load xong dữ liệu -> ẩn icon loading
                    setTimeout(function() {
                        $('#t-load-overlay').hide();
                    }, 1000);
                }
            }
        });

        // Thực hiện tính toán dữ liệu hiển thị lên giao diện: (Tổng số bản ghi, thông tin index của bản ghi)
        const totalRecord = data.TotalRecord;   // Tổng số bản ghi
        const totalPage = data.TotalPage;   // Tổng số trang
        $('#t-total-record-filter').text(totalRecord);

        // Tính toán việc hiển thị số trang Pagingbar
        // Nếu tổng số trang lớn hơn số button trang hiển thị trên giao diện -> render ra 5 button
        $('#t-content-footer .t-list-page').empty();
        if(me.maxPageIndexButton <= totalPage) {
            // Lấy thông tin trang hiện tại:
            let currentPageIndex = me.currentPageIndex;
            // Xác định xem trang hiện tại nằm ở phạm vi nào:
            let totalRange = 0;     // Tổng số dãy button (mỗi dãy có maxPageIndexButton button)
            if( totalPage % me.maxPageIndexButton == 0 ) {
                totalRange = Number.parseInt(totalPage / me.maxPageIndexButton);
            } else {
                totalRange = Number.parseInt(totalPage / me.maxPageIndexButton) + 1;
            }

            // Range hiện tại của button: (vị trí hiện tại của button đang nằm ở range nào)
            let currentRange = 1;
            if( me.currentPageIndex % me.maxPageIndexButton == 0 ) {
                currentRange = Number.parseInt(me.currentPageIndex / me.maxPageIndexButton);
            } else {
                currentRange = Number.parseInt(me.currentPageIndex / me.maxPageIndexButton) + 1;
            }

            // Xác định button đầu là trang số bao nhiêu:
            let startButton = (currentRange - 1) * me.maxPageIndexButton + 1;
            
            // Render các button:
            for(let i = 0 ; i < me.maxPageIndexButton ; i++) {
                let buttonHTML = $(`<div class="t-page-number">${startButton}</div>`);
                buttonHTML.data('value', startButton);  // Set value cho mỗi button
                if(me.currentPageIndex == startButton) {
                    buttonHTML.addClass('t-page-active');
                }
                $('#t-content-footer .t-list-page').append(buttonHTML);
                startButton++;
            }
        }
        else {  // Nếu nhỏ hơn số button trang hiển thị trên giao diện -> render ra totalPage button
            for(let pageIndex = 1 ; pageIndex <= totalPage ; pageIndex++) {
                let buttonHTML = $(`<div class="t-page-number">${pageIndex}</div>`);
                buttonHTML.data('value', pageIndex);  // Set value cho mỗi button
                if(me.currentPageIndex == pageIndex) {
                    buttonHTML.addClass('t-page-active');
                }
                $('#t-content-footer .t-list-page').append(buttonHTML);
            }
        }
    }
}