$(document).ready(function() {
    new employeePage;
})

class employeePage {
    FormMode = null;
    idSelected = null;
    nameSelected = null;
    constructor() {
        // Load dữ liệu
        this.loadData();

        // Khởi tạo sự kiện
        this.initEvent();
    }

    /**
     * Hàm khởi tạo các sự kiện
     * Author: NPTAN (28/11/2021)
     * Version: 1
     */
    initEvent() {
        // Click btn reload dữ liệu:
        $('#t-top-content .t-load-btn').click(this.loadData.bind(this));

        // Mở popup thêm mới nhân viên:
        $('#t-content .t-btn-add').click(this.openPopup.bind(this));    // Click nút thêm mới nhân viên
        $('#t-overlay .t-close-icon').click(this.closePopup);
        $('#t-overlay .t-popup-cancel').click(this.closePopup);
        $('#t-overlay .t-save-only').click(this.closePopup);

        // Click thêm mới nhân viên:
        $('#t-overlay .t-save-and-add').click(this.addEmployee.bind(this));

        // Click sửa thông tin nhân viên:
        $('#t-content .t-employee-function .t-function-name').on('click', this.changeData.bind(this));

        // Sự kiện click vào nút sửa trên bản ghi (Hộp chức năng):
        $('#t-table-content .t-function-extend').click(this.openFunctionBox);
        
        // Click vào nút xóa bản ghi:
        $('#t-table-content .t-function-remove').on('click', this.openDialogWarning.bind(this));
        $('#t-dialog .t-dialog-cancel').click(this.closeDialogWarning);
        $('#t-dialog .t-dialog-agree').click(this.delete.bind(this));

        // Click chọn giới tính:
        $('.t-select-gender input').on('click', this.handleRadioGender);

    }

    // Mở/Đóng hộp chức năng:
    openFunctionBox(e) {
        // console.log(e.target);
        // console.log(this);
        // console.log($(e.target).children());

        // Mở hộp chức năng:
        $(e.target).children().fadeToggle(300);

        // Đóng hộp chức năng:
        // let functionItem = $(e.target).children();
        // functionItem.on('click', function() {
        //     $(funcionItem).hide();
        // })

    }

    // Mở/Đóng popup thêm mới nhân viên:
    openPopup(e) {
        // Reset tất cả các input
        // let inputs = $('#t-overlay .t-popup-content input');
        // for (const input of inputs) {
        //     $(input).val(unset);
        // }
        // debugger

        
        let me = this;
        me.FormMode = Enum.FormMode.Add;

        $('#t-overlay').fadeIn(300);

        // Auto tạo mã nhân viên mới:
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            async: false,
            success: function (response) {
                if(response) {
                    const employeeCode = response;
                    $('.t-code-info input').val(employeeCode);
                }
            },
            error: function(reject) {
                alert('Tạo mã nhân viên không thành công!');
            }
        });

        // Đóng popup:
        // $('#t-overlay .t-close-icon').click(this.closePopup);
        // $('#t-overlay .t-popup-cancel').click(this.closePopup);
        // $('#t-overlay .t-save-only').click(this.closePopup);

        // Click chọn giới tính:
        // $('.t-select-gender input').on('click', this.handleRadioGender);

    }

    closePopup(e) {
        // console.log(e.target);
        $('#t-overlay').fadeOut(300);

        // Reset tất cả các input
        let inputs = $('#t-overlay .t-popup-content input');
        for (const input of inputs) {
            $(input).val(unset);    // Gán về giá trị value mặc định ban đầu
        }

        // Reset tất cả các combobox
        let comboboxs = $('#t-popup div[tcombobox]');
        for (const combobox of comboboxs) {
            $(combobox).val(unset)
            debugger
        }
    }

    // Mở/Đóng dialog warning:
    openDialogWarning(sender) {
        $('#t-dialog').fadeIn(300);

        // Lấy ra id và họ và tên của bản ghi:
        let currentRecord = $(sender.target).parents('.t-row-table');
        let employeeId = currentRecord.data('employeeId');
        let fullName = $(currentRecord).children('.t-employee-name').text();
        this.idSelected = employeeId;
        this.nameSelected = fullName;
        debugger

        // Build dữ liệu cho dialog:
        $('#t-name-remove').text(`<${fullName}>`);

        // Đóng hộp chức năng:
        $('#t-table .t-function-box').hide();
    }

    closeDialogWarning() {
        $('#t-dialog').fadeOut(300);
    }


    /**
     * Thêm mới nhân viên
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    addEmployee(sender) {
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
            debugger
        }
        // return;

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
            debugger
        }

        // Gọi đến api cất dữ liệu:
        if(me.FormMode == Enum.FormMode.Add) {
            debugger
            $.ajax({
                type: "POST",
                url: "http://cukcuk.manhnv.net/api/v1/Employees",
                // async: false,
                data: JSON.stringify(employee),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    // Load lại dữ liệu:
                    me.loadData();
                    debugger
                    // Ẩn popup:
                    $('#t-overlay').fadeOut(300);
                }
            });
        }
        else {
            debugger
            $.ajax({
                type: "PUT",
                url: `http://cukcuk.manhnv.net/api/v1/Employees/${me.idSelected}`,
                // async: false,
                data: JSON.stringify(employee),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    // Load lại dữ liệu
                    me.loadData();
                    debugger
                    // Ẩn popup
                    $('#t-overlay').fadeOut(300);
                }
            });
        }
        
    }

    /**
     * Sửa thông tin nhân viên
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    changeData(sender) {

        // // Reset tất cả các input
        // let inputs = $('#t-overlay .t-popup-content input');
        // for (const input of inputs) {
        //     $(input).val(unset);    // Gán về giá trị value mặc định ban đầu
        // }

        let me = this;

        // Lấy ra employeeId (khóa chính) của bản ghi hiện tại:
        let currentRow = $(sender.target).parents('.t-row-table');
        // console.log(currentRow);
        // debugger
        let employeeId = $(currentRow).data('employeeId');

        // Lưu lại trạng thái:
        me.FormMode = Enum.FormMode.Update;
        // Lưu lại id của bản ghi đã được chọn:
        me.idSelected = employeeId;

        $.ajax({
            type: "GET",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
            // async: false,
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
                        debugger
                    }
                    else {
                        $(input).val(null);
                    }
                }

                // Hiển thị popup:
                $('#t-overlay').fadeIn(300);
            }
        });
        debugger

    }

    /**
     * Xóa bản ghi
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    delete(sender) {
        let me = this;
        debugger
        // Lấy ra id của bản ghi:
        // let employeeId = $(sender.target).parents('.t-row-table').data('employeeId');
        // Gọi đến api xóa bản ghi:
        $.ajax({
            type: "DELETE",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${me.idSelected}`,
            // async: false,
            success: function (response) {
                me.loadData();
                me.closeDialogWarning();
            }
        });
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
        debugger
    }


    /**
     * Hàm load dữ liệu từ API
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    loadData() {

        let me = this;
        // Clear dữ liệu cũ:
        $('#t-table tbody').empty();
        // Hiện icon loading
        $('#t-load-overlay').show();

        // Gọi đến api để lấy dữ liệu:
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees",
            async: false,
            success: function (response) {
                if(response) {
                    let employees = response;
                    // Duyệt từng từng nhân viên có trong mảng:
                    for (const employee of employees) {
                        // Build các tr và append vào table:
                        let tr = $(`<tr class="t-row-table">
                            <td class="t-checkbox t-col-border t-padding-10"> <input type="checkbox" name="" id=""> </td>
                            <td class="t-employee-code t-col-border t-padding-10">${employee.EmployeeCode || ''}</td>
                            <td class="t-employee-name t-col-border t-padding-10">${employee.FullName || ''}</td>
                            <td class="t-employee-gender t-col-border t-padding-10 t-align-center">${employee.GenderName || ''}</td>
                            <td class="t-employee-date t-col-border t-padding-10 t-align-center">${CommnonJS.formatDateDDMMYYYY(employee.DateOfBirth) || ''}</td>
                            <td class="t-employee-cmnd t-col-border t-padding-10">${employee.IdentityNumber || ''}</td>
                            <td class="t-employee-position t-col-border t-padding-10">${employee.PositionName || ''}</td>
                            <td class="t-employee-unit t-col-border t-padding-10">${employee.DepartmentName || ''}</td>
                            <td class="t-employee-account-number t-col-border t-padding-10">${''}</td>
                            <td class="t-employee-bank t-col-border t-padding-10">${''}</td>
                            <td class="t-employee-branch t-col-border t-padding-10">${employee.Address || ''}</td>
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
                    }, 1000)

                    me.initEvent();
                }
            }

        });

        
        // me.initEvent();
    }


}


