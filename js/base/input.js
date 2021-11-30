$(document).ready(function() {
    new InputElement;
})


/**
 * Xử lý các sự kiện focus và blur của thẻ input
 * Author: NPTAN (30/11/2021)
 * Version: 1
 */
class InputElement {
    static notValue = null;
    constructor() {
        this.initEvent();
        this.handleInput();
        // this.checkInput();
    }

    /**
     * Khởi tạo các sự kiện với thẻ input
     * Author: NPTAN (30/11/2021)
     * Version: 1
     */
    initEvent() {
        // Kiểm tra thiếu thông tin:
        // console.log($('#t-popup input[required]'));

        // Lấy ra các input có attribute là required:
        let inputs = $('#t-popup input[required]');
        for(let i=1 ; i<inputs.length-1 ; i++) {
            let inputPrev = inputs[i-1];
            let inputCurrent = inputs[i];
            
            $(inputCurrent).focus(function() {
                // console.log(inputPrev);
                // console.log($(inputPrev).val());
                
                // Lấy ra giá trị của ô input trước đó:
                let value = $(inputPrev).val();
                if( !value ) {
                    // Nếu ô input trước đó không có giá trị thì báo lỗi:
                    $(inputPrev).siblings('#t-required').show();
                    inputPrev.style.borderColor = 'red';
                }
                else {
                    // $(inputPrev).siblings('#t-required').show();
                    inputPrev.style.borderColor = null;
                }
            })
        }

        // Khi click vào nút cất và thêm dữ liệu, kiểm tra tất cả các input bắt buộc đã được nhập hết chưa:
        let inputSubmit = inputs[inputs.length-1];
        $(inputSubmit).click(function() {
            for(let i=0 ; i<inputs.length-2 ; i++) {
                let input = inputs[i];
                if( !$(input).val() ) {
                    $(input).siblings('#t-required').show();
                    input.style.borderColor = 'red';
                    break;
                }
                else {
                    input.style.borderColor = null;
                }
            }
        })

    }

    /**
     * Xử lí sự kiện của các input khi được focus, click
     * Author: NPTAN (30/11/2021)
     * Version: 1
     */
    handleInput() {
        // Lấy ra các input có attribute là required:
        let inputs = $('#t-popup input[required]');
        for (const input of inputs) {
            $(input).click(function() {
                $(input).siblings('#t-required').hide();
                input.style.borderColor = null;
            })
        }
    }



    /**
     * Hàm check các trường nhập liệu bắt buộc đã có dữ liệu hay chưa
     * Có dữ liệu: True
     * Chưa có dữ liệu: False
     * 
     * Author: NPTAN (30/11/2021)
     * Version 1:
     */
    static checkInput() {
        // Lấy ra các input có attribute là required:
        let inputs = $('#t-popup input[required]');
        
        // Kiểm tra các trường dữ liệu bắt buộc:
        for (let i=0 ; i<inputs.length-2 ; i++) {
            let input = inputs[i];
            if( !$(input).val() ) {
                this.notValue = input;
                return false;
            }
        }
        return true;
    }


}