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