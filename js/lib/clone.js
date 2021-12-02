$(document).ready(function() {
    new employeePage;
})


class employeePage {
    constructor() {
        this.loadData();
        this.initEvent();
    }

    /**
     * Load dữ liệu
     * Author: NPTAN (01/12/2021)
     */
    loadData() {   
        alert('load data')
        // Clear dữ liệu cũ:
        $("#t-table tbody").empty();
        // Gọi api thực hiện lấy dữ liệu về -> sử dụng ajax
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees",
            async:false,
            success: function (response) {
                if(response) {
                    let employees = response;
                    // Duyệt từng nhân viên có trong mảng:
                    for (const employee of employees) {
                        // Build từng tr và append vào tbody của table
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

                        // Lưu trữ khóa chính của dòng dữ liệu hiện tại:
                        tr.data('employeeId', employee.EmployeeId);
                        tr.data('data', employee);
                        $("#t-table tbody").append(tr);
                    }
                }
            }
        });

    }


    /**
     * Khởi tạo các sự kiện:
     * Author: NPTAN (01/12/2021)
     */
    initEvent() {
        $('.t-function-name').on('click', function() {
            alert('ok');
        })

        $('.t-load-btn').click(this.reloadData.bind(this));
    }

    // Reload data:
    reloadData(sender) {
        let me = this;
        this.loadData();
        $('.t-function-name').on('click', function() {
            alert('ok');
        })
    }
    

}








//  loadData

/**
     * Hàm load dữ liệu từ API (Dữ liệu không có filter. Phải xử lý như thế này vì khi lọc dữ liệu bắt buộc phải chuyền vào text khác null)
     * Author: NPTAN (29/11/2021)
     * Version: 1
     */
    // loadData() {

    //     let me = this;
    //     // Clear dữ liệu cũ:
    //     $('#t-table tbody').empty();
    //     // Hiện icon loading
    //     $('#t-load-overlay').show();

    //     // Gọi đến api để lấy dữ liệu:
    //     $.ajax({
    //         type: "GET",
    //         url: "http://amis.manhnv.net/api/v1/Employees",
    //         async: false,
    //         success: function (response) {
    //             if(response) {
    //                 let employees = response;
    //                 // Duyệt từng từng nhân viên có trong mảng:
    //                 for (const employee of employees) {
    //                     // Build các tr và append vào table:
    //                     let tr = $(`<tr class="t-row-table">
    //                         <td class="t-checkbox t-col-border t-padding-10"> <input type="checkbox" name="" id=""> </td>
    //                         <td class="t-employee-code t-col-border t-padding-10">${employee.EmployeeCode || ''}</td>
    //                         <td class="t-employee-name t-col-border t-padding-10">${employee.EmployeeName || ''}</td>
    //                         <td class="t-employee-gender t-col-border t-padding-10 t-align-center">${employee.GenderName || ''}</td>
    //                         <td class="t-employee-date t-col-border t-padding-10 t-align-center">${CommnonJS.formatDateDDMMYYYY(employee.DateOfBirth) || ''}</td>
    //                         <td class="t-employee-cmnd t-col-border t-padding-10">${employee.IdentityNumber || ''}</td>
    //                         <td class="t-employee-position t-col-border t-padding-10">${employee.EmployeePosition || ''}</td>
    //                         <td class="t-employee-unit t-col-border t-padding-10">${employee.DepartmentName || ''}</td>
    //                         <td class="t-employee-account-number t-col-border t-padding-10">${employee.BankAccountNumber || ''}</td>
    //                         <td class="t-employee-bank t-col-border t-padding-10">${employee.BankName || ''}</td>
    //                         <td class="t-employee-branch t-col-border t-padding-10">${employee.BankBranchName || ''}</td>
    //                         <td class="t-employee-function t-border-bottom t-padding-10 t-align-center">
    //                             <div class="t-function-btn">
    //                                 <div class="t-function-name t-mg-right-4">Sửa</div>
    //                                 <div class="t-function-extend">
    //                                     <div class="t-function-box">
    //                                         <div class="t-box-item">Nhân bản</div>
    //                                         <div class="t-box-item t-function-remove">Xóa</div>
    //                                         <div class="t-box-item">Ngừng sử dụng</div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </td>
    //                     </tr>`);

    //                     // Lưu trữ khóa chính của mỗi row của table
    //                     tr.data('employeeId', employee.EmployeeId);
    //                     tr.data('data', employee);
    //                     $('#t-table tbody').append(tr);
    //                 }
                    
    //                 // Hiển thị số bản ghi và danh sách bản ghi:
    //                 $('#t-content-footer .t-list-page').empty();
    //                 $('#t-total-record-filter').text(`${employees.length}`);
                    // $('#t-content-footer .t-list-page').append(`<div class="t-page-number">1</div>
                    //                                             <div class="t-page-number">2</div>
                    //                                             <div class="t-page-number">3</div>
                    //                                             <div class="t-page-number">...</div>
                    //                                             <div class="t-page-number">89</div>`);

    //                 // Load xong dữ liệu -> ẩn icon loading
    //                 setTimeout(function() {
    //                     $('#t-load-overlay').hide();
    //                 }, 1000)

                    
    //             }
    //         }

    //     });

    // }
