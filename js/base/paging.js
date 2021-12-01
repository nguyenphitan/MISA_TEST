$(document).ready(function() {
    new Paging;
})

/**
 * Xử lý phân trang
 * Author: NPTAN (01/12/2021)
 * Version: 1
 */
class Paging {
    constructor() {
        this.initEvent();
    }

    // Xử lý các sự kiện phân trang:
    initEvent() {
        // Click chuyển trang:
        // 1. Click chuyển tới trang trước đó:
        $('#t-content-footer .t-pre-page').click(this.selectPrevPage.bind(this));
        // 2. Click chuyển tới trang tiếp theo:
        $('#t-content-footer .t-next-page').click(this.selectNextPage.bind(this));
        // 3. Chuyển tới trang bất kì được click:
        // $('#t-content-footer .t-page-number').on('click', this.selectClickPage.bind(this));

        // Hiển thị số bản ghi/trang:
        $('#t-content-footer #t-combobox-number').change(this.showRecord.bind(this));
    }

    // Hiển thị số bản ghi/trang:
    showRecord(sender) {
        let me = this;
        me.loadDataFilter(me.currentPageIndex);
    }

    // Chuyển tới trang bất kì được click:
    // selectClickPage(sender) {
    //     let me = this;
    //     // Duyệt các phần tử cùng cấp, xóa class active của các phần tử đó:
    //     let pages = $(sender.target).siblings('.t-page-number');
    //     for (const page of pages) {
    //         $(page).removeClass('t-page-active');
    //     }

    //     // Thêm class active cho page hiện tại (page được click):
    //     $(sender.target).addClass('t-page-active');
        
    //     // Lấy ra giá trị của button:
    //     let value = $(sender.target).data('value');
    //     // alert(value);
    //     me.currentPageIndex = value;
    //     me.loadDataFilter(value);
    // }

    // Quay lại trang trước đó:
    selectPrevPage(sender) {
        let me = this;
        // Chuyển focus sang button số của trang tương ứng:
        // Xác định button của trang hiện tại, xóa class avtive của nó:
        let currentPage = $(sender.target).siblings('.t-list-page').children().filter('.t-page-active');
        // console.log(currentPage);
        $(currentPage).removeClass('t-page-active');
        // Xác định button tiếp theo, thêm class active cho nó:
        let prevPage = $(currentPage).prev();
        $(prevPage).addClass('t-page-active');

        // Lấy ra giá trị của button:
        let value = $(prevPage).data('value');
        // alert(value);
        me.currentPageIndex = value;
        me.loadDataFilter(value);

    }

    // Chuyển tới trang tiếp theo:
    selectNextPage(sender) {
        let me = this;
        // Chuyển focus sang button số của trang tương ứng:
        // Xác định button của trang hiện tại, xóa class avtive của nó:
        let currentPage = $(sender.target).siblings('.t-list-page').children().filter('.t-page-active');
        // console.log(currentPage);
        $(currentPage).removeClass('t-page-active');
        // Xác định button tiếp theo, thêm class active cho nó:
        let nextPage = $(currentPage).next();
        $(nextPage).addClass('t-page-active');

        // Lấy ra giá trị của button:
        let value = $(nextPage).data('value');
        // alert(value);
        me.currentPageIndex = value;
        me.loadDataFilter(value);
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
        // $('#t-load-overlay').show();

        // Lấy các thông tin thực hiện phân trang:
        let searchText = $('#t-input-text').val();
        const pageSize = $('#t-combobox-number').val();    // Số bản ghi/trang
        if( !pageNumber ) {
            pageNumber = 1;
        }
        searchText = (searchText ? searchText : '');
        let apiUrl = `http://cukcuk.manhnv.net/api/v1/Employees/Filter?pageSize=${pageSize}&pageNumber=${pageNumber}&fullName=${searchText}`;
        // debugger


        let data = [];
        // Gọi đến api để lấy dữ liệu:
        $.ajax({
            type: "GET",
            url: apiUrl,
            async: false,
            success: function (response) {
                if(response) {
                    // debugger
                    data = response;
                    let employees = response;
                    // Duyệt từng từng nhân viên có trong mảng:
                    for (const employee of employees.Data) {
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
        

        // Thực hiện tính toán dữ liệu hiển thị lên giao diện: (Tổng số bản ghi, thông tin index của bản ghi)
        const totalRecord = data.TotalRecord;   // Tổng số bản ghi
        const totalPage = data.TotalPage;   // Tổng số trang
        $('#t-total-record').text(totalRecord);

        // console.log(me.maxPageIndexButton);
        // Tính toán việc hiển thị số trang Pagingbar
        // Nếu tổng số trang lớn hơn số button trang hiển thị trên giao diện -> render ra 5 button
        // Nếu nhỏ hơn số button trang hiển thị trên giao diện -> render ra totalPage button
        $('#t-content-footer .t-list-page').empty();
        if(me.maxPageIndexButton <= totalPage) {
            // Lấy thông tin trang hiện tại:
            let currentPageIndex = me.currentPageIndex;
            // Xác định xem trang hiện tại nằm ở phạm vi nào:
            let totalRange = 0;     // Tổng số dãy button (mỗi dãy có maxPageIndexButton button)
            if( totalPage % me.maxPageIndexButton == 0 ) {
                totalRange = Number.parseInt(totalPage / me.maxPageIndexButton);
            }
            else {
                totalRange = Number.parseInt(totalPage / me.maxPageIndexButton) + 1;
            }
            // Range hiện tại của button: (vị trí hiện tại của button đang nằm ở range nào)
            let currentRange = 1;
            if( me.currentPageIndex % me.maxPageIndexButton == 0 ) {
                currentRange = Number.parseInt(me.currentPageIndex / me.maxPageIndexButton);
            }
            else {
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
                // debugger
            }
        }
        else {
            for(let i = 0 ; i < totalPage ; i++) {
                let buttonHTML = `<div class="t-page-number">${i+1}</div>`;
                $('#t-content-footer .t-list-page').append(buttonHTML);
            }
        }

    }

}