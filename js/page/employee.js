$(document).ready(function() {
    new employeePage;
})

class employeePage {
    constructor() {
        // Load dữ liệu


        // Khởi tạo sự kiện
        this.initEvent();
    }

    /**
     * Hàm khởi tạo các sự kiện
     * Author: NPTAN (28/11/2021)
     */
    initEvent() {
        // Sự kiện click vào nút sửa trên bản ghi:
        $('#t-table-content .t-function-extend').on('click', this.openFunctionBox);
        // Mở dialog:
        $('#t-table-content .t-function-remove').on('click', this.openDialogWarning);
        $('#t-dialog .t-dialog-cancel').on('click', this.openDialogWarning);
        $('#t-dialog .t-dialog-agree').on('click', this.openDialogWarning);
        

        // Mở popup thêm mới nhân viên:
        $('#t-content .t-btn-add').on('click', this.openPopup);
        $('#t-overlay .t-close-icon').on('click', this.openPopup);
        $('#t-overlay .t-popup-cancel').on('click', this.openPopup);
        $('#t-overlay .t-save-only').on('click', this.openPopup);
        $('#t-overlay .t-save-and-add').on('click', this.openPopup);

    }

    // Mở/Đóng hộp chức năng:
    openFunctionBox(e) {
        // console.log(e.target);
        $('#t-table-content .t-function-box').fadeToggle(300);
    }

    // Mở/Đóng popup thêm mới nhân viên:
    openPopup() {
        $('#t-overlay').fadeToggle(300);
    }

    // Mở/Đóng dialog warning:
    openDialogWarning() {
        $('#t-dialog').fadeToggle(300);
    }


}


