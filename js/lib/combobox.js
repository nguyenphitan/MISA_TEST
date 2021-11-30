$(document).ready(function() {
    new TCombobox;
    // Thực hiện build động các combobox tự dựng:




    // Khởi tạo sự kiện cho button của combobox
    $(".tcombobox .t-combobox-button").click(btnComboboxOnclick);
    $(".tcombobox .t-combobox-item").click(itemComboboxOnclick);
    $(".tcombobox").on('click', '.t-combobox-item', itemComboboxOnclick);
    $(".tcombobox input").keydown(inputComboboxOnKeyDown);
    $(".tcombobox input").keyup(inputComboboxOnKeyUp);

    // Lưu trữ thông tin của combobox data:
    let comboboxs = $('.tcombobox');
    for(const combobox of comboboxs) {
        // Load dữ liệu cho api:
        // Kiểm tra xem có khai báo thông tin api lấy dữ liệu hay không?
        const api = $(combobox).attr('api');
        const propertyDisplay = $(combobox).attr('propertyDisplay');
        const propertyValue = $(combobox).attr('propertyValue');
        if(api && propertyDisplay && propertyValue) {
            // Lấy dữ liệu từ api
            $.ajax({
                type: "GET",
                url: api,
                async: false,
                success: function (data) {
                    // Build combobox data
                    for (const item of data) {
                        let text = item[propertyDisplay];
                        let value = item[propertyValue];
                        let itemHTML = `<div class="t-combobox-item" value="${value}">${text}</div>`
                        $(combobox).find('.t-combobox-data').append(itemHTML);
                    
                    }
                }
            });
        } 

        // Lưu trữ các thông tin cần thiết vào data của combobox
        let itemDataElements = $(combobox).find('.t-combobox-data').html();
        $(combobox).data('itemDataElement', itemDataElements);
        // $(combobox).find('.t-combobox-data').empty();

    } 
})


class TCombobox {
    constructor() {
        this.buildComboboxHTML();
    }

    buildComboboxHTML() {
        // Duyệt tất cả các thẻ là combobox
        let comboboxs = $('combobox');
        for (const combobox of comboboxs) {
            // Lấy ra các thông tin cần thiết (VD: api lấy dữ liệu, trường thông tin sẽ hiển thị, trường giá trị của từng item)
            const api = $(combobox).attr('api');
            const propertyDisplay = $(combobox).attr('propertyDisplay');
            const propertyValue = $(combobox).attr('propertyValue');
            const fieldName = $(combobox).attr('fieldName');
            const id = $(combobox).attr('id');
            // Build HTML của combobox:
            let comboboxHTML = $(`<div tcombobox id="${id||''}" class="tcombobox t-input-info" value="" fieldName="${fieldName}">
                                <input type="text" class="t-combobox t-combobox-input">
                                <button tabindex="-1" class="t-combobox-button">
                                    <i class="t-combobox-extends"></i>
                                </button>
                                <div class="t-combobox-data">
                                </div>
                            </div>`);
            comboboxHTML.data('fieldName', fieldName);

            // Nếu có khai báo các api, trường thông tin của dữ liệu thì build các item
            if(api && propertyDisplay && propertyValue) {
                // Lấy dữ liệu từ api
                $.ajax({
                    type: "GET",
                    url: api,
                    async: false,
                    success: function (data) {
                        // Build combobox data
                        for (const item of data) {
                            let text = item[propertyDisplay];
                            let value = item[propertyValue];
                            let itemHTML = `<div class="t-combobox-item" value="${value}">${text}</div>`
                            $(comboboxHTML).find('.t-combobox-data').append(itemHTML);
                            
                        }
                    }
                });
            }
            else {
                // Lấy ra các Node là item:
                let items = $(combobox).children('item');
                // Thực hiện build từng item data cho combobox:
                for (const item of items) {
                    const text = $(item).text();
                    const value = $(item).attr('value');
                    let itemHTML = `<div class="t-combobox-item" value="${value}">${text}</div>`;
                    $(comboboxHTML).find('.t-combobox-data').append(itemHTML);
                }
            }
            $(combobox).replaceWith(comboboxHTML);
            
        }
    }
}

function inputComboboxOnKeyUp() {

    // Loại bỏ một số phím đặc biệt:
    switch(event.keyCode) {
        case 13:
        case 40:
        case 38:
            break;
        default:
        $(this).siblings('.t-combobox-data').empty();
        let itemDataElement = $(this.parentElement).data('itemDataElement');

        // Build html cho các combobox data item:
        $(this).siblings('.t-combobox-data').html(itemDataElement);

        // Thực hiện lọc dữ liệu trong data item:
        // 1. Lấy value đã nhập trên input:
        const valueInput = this.value;
        // $('.t-combobox-data .t-combobox-item').filter(function() {
        //     $(this).toggle($(this).text().toLowerCase().indexOf(valueInput) > -1);
        // });

        // 2. Duyệt từng item và thực hiện kiểm tra xem element nào có value hợp lệ
        let items = $(this).siblings('.t-combobox-data').children();
        for(const item of items) {
            // debugger
            let text = item.textContent;
            if(!text.toLowerCase().includes(valueInput.toLowerCase())) {
                item.remove();
            }
            // debugger
        }
        $(this).siblings('.t-combobox-data').show();

        break;
    }

}

function inputComboboxOnKeyDown() {
    // Hiển thị data của combobox:
    
    // Lấy tất cả item element trong data
    let items = $(this).siblings('.t-combobox-data').children();

    // Kiểm tra xem có item nào đã ở trạng thái đã được hover chưa:
    let itemHoverred = items.filter('.t-combobox-item-hover');

    // Bỏ hover tất cả các iteam đã được set trước đó:
    // $(items).removeClass('t-combobox-item-hover');

    switch(event.keyCode) {
        case 13: // Khi nhấn phím enter
            // Nếu có item nào đó đã được chọn, thì lấy text -> gán cho input, value -> gán cho combobox
            if(itemHoverred.length == 1) {
                itemHoverred = itemHoverred[0];
                let text = $(itemHoverred).text();
                let value = $(itemHoverred).attr('value');
                // 3. Gán text vào input của combobox
                // Tìm đến element parent đầu tiên
                let parentItem = $(itemHoverred).parent();
                // tìm đến anh em của parent là input và gán text
                parentItem.siblings('.t-combobox-input').val(`${text}`);

                // 4. Gán value cho combobox
                let comboboxElement = $(itemHoverred).parents('.tcombobox');
                // Cách 1: thực hiện lưu value vào attribute của element
                // comboboxElement.attr("value", value);
                // Cách 2: gán vào data của element
                comboboxElement.val(value);    

                // Ẩn conbobox data
                $(parentItem).hide();
            }
            break;

        case 40:    // nhấp mũi tên xuống trên bàn phím
            // Nếu đã có item được chọn trước đó thì hover tới item kết tếp:
            if(itemHoverred.length > 0) {
                // Lấy item kế tiếp:
                let nextElement = itemHoverred.next();
                // Thêm class hover cho item kế tiếp:
                nextElement.addClass('t-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('t-combobox-item-hover');
            }
            else {
                // Nếu chưa có iteam nào được chọn trước đó thì mặc định chọn item đầu tiên
                $(this).siblings('.t-combobox-data').show();
                let firstItem = items[0];
                $(firstItem).addClass("t-combobox-item-hover");
            }

            break;
        case 38:    // nhấn mũi tên lên trên bàn phím
            // Nếu đã có item được chọn trước đó thì hover tới item trước nó:
            if(itemHoverred.length > 0) {
                // Lấy item trước nó:
                let prevElement = itemHoverred.prev();
                // Thêm class hover cho item trước nó:
                prevElement.addClass('t-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('t-combobox-item-hover');
            }
            else {
                // Nếu chưa có iteam nào được chọn trước đó thì mặc định chọn item cuối cùng
                $(this).siblings('.t-combobox-data').show();
                let lastItem = items[items.length - 1];
                $(lastItem).addClass("t-combobox-item-hover");
            }

            break;
        default:
            break;
    }
    
}

function btnComboboxOnclick() {
    // Ẩn/Hiện combobox data
    $(this).siblings('.t-combobox-data').toggle();
}

function itemComboboxOnclick() {
    // Hiển thị text ở item vừa chọn lên input của combobox
    // 1. Lấy text trong item vừa chọn
    const text = $(this).text();
    
    // 2. Lấy ra value của iteam vừa chọn
    const value = $(this).attr("value");

    // 3. Gán text vào input của combobox
    // Tìm đến element parent đầu tiên
    let parentItem = $(this).parent();
    // tìm đến anh em của parent là input và gán text
    parentItem.siblings('.t-combobox-input').val(`${text}`);

    // 4. Gán value cho combobox
    let comboboxElement = $(this).parents('.tcombobox');
    // Cách 1: thực hiện lưu value vào attribute của element
    comboboxElement.attr("value", value);
    // Cách 2: gán vào data của element
    comboboxElement.data("value", value);    

    // Ẩn conbobox data
    $(parentItem).hide();
}



