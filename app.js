// bao icon giỏ hàng và số
const cartBtn = document.querySelector(".cart-btn");
// icon đóng giỏ hàng
const closeCartBtn = document.querySelector(".close-cart");
// icon làm sạch giỏ hàng
const clearCartBtn = document.querySelector(".clear-cart");
// bao tất cả giỏ hàng
const cartDOM = document.querySelector(".cart");
// bao tất cả giỏ hàng lớn hôn .cart ở trên
const cartOverlay = document.querySelector(".cart-overlay");
// số của icon giỏ hàng
const cartItems = document.querySelector(".cart-items");
// tổng tiền trong giỏ hàng
const cartTotal = document.querySelector(".cart-total");
// bao thẻ div mỗi sản phẩm trong giỏ hàng
const cartContent = document.querySelector(".cart-content");
// bảo thẻ div mỗi sản phẩm hiển thị bên ngoài
const productsDOM = document.querySelector(".products-center");
let cart = [];
let buttonsDOM = [];
class Products {
    // lấy thông tin all object mỗi sản phẩm từ array
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            // lấy ra được 8 object nằm trong array items[]
            console.log("test 1: ");
            console.log(products);



            products = products.map(item => {
                const { title, price, image } = item.fields;
                console.log("test 2: " + title + " - " + price + " - " + image);
                const id = item.sys;
                console.log("test 3: " + id);
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <article class="product">
            <div class="img-container">
                <img src="${product.image}" alt="product" class="product-img">


                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>


            <h3 class="">${product.title}</h3>


            <h4 class="">$${product.price}</h4>
        </article>
            `
        });
        console.log("------------------")
        console.log(result)
        console.log("------------------")
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        // id của nút add to cart
        const buttons = [...document.querySelectorAll(".bag-btn")];
        console.log("test 5: ");
        console.log(buttons);
        // buttonsDOM là 1 array rỗng
        buttonsDOM = buttons;
        // gán array chứa các class của các button này vào array rỗng
        buttons.forEach(button => {
            // lấy ra dataset-id của 8 cái button 
            let id = button.dataset.id;
            console.log("test 6: " + id);
            // cart cũng là 1 array rỗng
            console.log("test 7: ");
            console.log(cart);
            // tìm trong cái array cart (hay nói cách khác là trong giỏ hàng) 
            // này xem có sản phẩm nào có id dataset (id của button) 
            // giống với cái id của người dùng click thêm vào giỏ hàng
            // hay không
            // nếu có thì trả về duy nhất 1 object thỏa điều kiện đầu tiên
            let inCart = cart.find(item => item.id === id);
            console.log("test 8: ");
            console.log(inCart);
            // sản phẩm đã được thêm vào giỏ hàng
            // và id của sản phẩm tồn tại
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }
            // các sản phẩm chưa được thêm vào giỏ hàng
            else {
                // khi người dùng click vào 1 sản phẩm
                // thì đã lấy được 1 id dataset rồi
                button.addEventListener("click", event => {
                    event.target.innerText = "In Cart";
                    // khi users click vào sản phẩm này 
                    // nghĩa là sản phẩm này sẽ được thêm vào trong giỏ hàng
                    // thì sau đó user sẽ không thể thêm sp này vào 
                    // giỏ hàng được nữa, vì vậy phải vô hiệu
                    // hóa cái button của sản phẩm này sau khi 
                    // thêm vào giỏ hàng xong
                    event.target.disabled = true;


                    // get product from products
                    // let cartItem = Storage.getProduct(id);
                    // mỗi lần người dùng click vào 1 sp
                    // sẽ lấy ra được 1 object sản phẩm người
                    // dùng vừa click vào từ 8 object sản phẩm
                    // trên storage, thêm vào 1 thuộc tính mới
                    let cartItem = { ...Storage.getProduct(id), amount: 1 };
                    console.log("test 9: ");
                    console.log(cartItem);
                    // add product to the cart
                    // cart lúc này vẫn đang là rỗng (tính từ giỏ hàng đang là 0)
                    // đưa cái object sp người dùng vừa click vào array cart
                    //cart = [...cart, cartItem];
                    cart.push(cartItem);
                    console.log("test 10: ");
                    console.log(cart);
                    // save cart in local storage
                    // mỗi lần như vậy sẽ lưu 1 object sp người dùng
                    // vừa click lên storage
                    // lưu lên store để khi refresh lại
                    // lấy dữ liệu giỏ hàng từ store về
                    // để lưu lại sản phẩm mà người dùng
                    // đã thêm vào giỏ hàng
                    Storage.saveCart(cart);
                    // set cart values
                    this.setCartValues(cart);
                    // display cart item
                    // để vào đây mỗi lần 1 object sp
                    // mà người dùng vừa thêm vào giỏ hàng 
                    // mỗi lần người dùng click thêm sp vào
                    // giỏ hàng, nó sẽ tạo ra 1 thẻ div
                    // sau đó thêm vào làm con của cart-content
                    this.addCartItem(cartItem);
                    // show the cart
                    // this.showCart();
                });
            }
        });
    }
    // item này chứa array các object sản phẩm mà người dùng vừa click
    setCartValues(item) {
        let tempTotal = 0;
        let itemsTotal = 0;
        // cart.forEach(item => {
        //     tempTotal += item.price * item.amount;
        //     itemsTotal += item.amount;
        // });
        // array cart lúc này đã có object sp người dùng vừa click
        // mỗi 1 sp trong cart or trong giỏ hàng sẽ tính toán 1 lần
        var total = cart.reduce((tempInitial, value) => {
            //tempInitial += value.price * value.amount;
            itemsTotal += value.amount;
            // return tempInitial;
            return tempInitial + value.price * value.amount;
        }, 0);
        tempTotal = total;
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src="${item.image}" alt="product" class=""/>


        <div class="item-list">
            <h4 class="">${item.title}</h4>
            <h5 class="">$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>


        <div class="item-value">
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
        if(cart.length === 0) {
            alert("Your shopping cart is empty!!!");
        }
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.popularCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    popularCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic() {
        // clear cart button
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });



        // cart functionality
        // bao thẻ div mỗi sp trong giỏ hàng
        // là thằng cha 
        cartContent.addEventListener("click", event => {
            console.log("test 21: ");
            console.log(event.target);
            // click vào những class con nào nằm trong thằng
            // cha mà class đó là: remove-item
            if (event.target.classList.contains("remove-item")) {
                // lấy được removeItem là thẻ span 
                // span là thẻ bao class remove-item
                let removeItem = event.target;
                console.log("test 22: ");
                console.log(removeItem);
                // lấy ra data-id của thẻ span là sp user vừa
                // click xóa
                // data-id = id 2 cái đều là 1
                let id = removeItem.dataset.id;
                // cha của span > item-list > cart-item
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                console.log(addAmount);
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
            else {

            }
        });
    }
    clearCart() {
        // // lấy ra all id sản phẩm trong giỏ hàng or cart
        // let cartItems = cart.map(item => item.id);
        // console.log("test 11: ");
        // console.log(cartItems);
        // // VD giỏ hàng có 3 sp tương tự với 3 id
        // // đầu tiên là id của sp thứ nhất
        // cartItems.forEach(id => this.removeItem(id))



        cart = [];
        this.setCartValues(cart);
        Storage.saveCart(cart);
        // cho all 8 button về trạng thái ban đầu
        buttonsDOM.forEach(button => {
            button.disabled = false;
            button.innerText = "add to cart";
            //button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
        });



        console.log("test 19: ");
        // bao nhiêu sp trong giỏ hàng
        // thì sẽ có bao nhiêu thằng div trong đây
        console.log(cartContent.hasChildNodes());
        // nếu trong cartContent có bao nhiêu sp
        // thì sẽ có bấy nhiêu thằng div
        // hasChild nghĩa là nếu trong cartContent có div
        // nghĩa là có thằng con trong đó
        // thì sẽ trả về true, ngược lại là false
        // có con, tức là trong giỏ hàng có sp
        while (cartContent.hasChildNodes() === true) {
            console.log("test 20: ");
            console.log(cartContent.firstChild);
            // xóa hết all thẻ div
            // or all sp hay all thằng con nằm trong thằng
            // cha cartContent
            cartContent.removeChild(cartContent.firstChild);
        }
        this.hideCart();
    }
    removeItem(id) {
        console.log("test 14: ");
        console.log(id);
        console.log("test 15: ");
        console.log(cart);
        // so sánh 3 id trong giỏ hàng id nào khác với id của
        // sp thứ nhất thì lấy
        // VD: 3 sp thì sẽ có 1 thằng trùng và 2 thằng khác id
        // lấy 2 thằng khác ra vì nó return true và
        // bỏ thằng trùng đi
        cart = cart.filter(item => {
            console.log("test 16: ");
            console.log(item);
            console.log("test 17: ");
            console.log(item.id !== id);
            return item.id !== id;
        });
        if(cart.length === 0) {
            this.hideCart();
        }
        // 16 lúc này chứa object của 2 thằng cuối (VD 3 sp)
        console.log("test 18: ");
        console.log(cart);
        // cập nhật hiển thị lại giá total và giá giỏ hàng mỗi lần
        // sau khi xóa 1 sản phẩm cả UI và cả storage
        this.setCartValues(cart);
        Storage.saveCart(cart);


        // phần dưới đây là dùng để enable lại sp đã disable khi user
        // click thêm sp giỏ hàng sau khi xóa
        // button chứa object của sản phẩm đầu tiên
        let button = this.getSingleButton(id);
        // enable lại cái button thêm vào giỏ hàng của sản phẩm đầu tiên
        button.disabled = false;
        // button.innerHTML = `
        //     <i class="fas fa-shopping-cart"></i>add to cart
        // `;
        button.innerText = "add to cart";
    }
    getSingleButton(id) {
        console.log("test 17: ");
        console.log(buttonsDOM);
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
class Storage {
    // lưu các object của mỗi sản phẩm lên storage
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        // lấy hết all object sp về từ storage
        // sau đó parse về dạng JSON
        let products = JSON.parse(localStorage.getItem("products"));
        console.log("test 11: ");
        console.log(products);
        // test thử nếu không phải dạng JSON thì nó ntn :)))
        let productss = localStorage.getItem("products");
        console.log("test 12: " + productss);
        // tìm trong các object sản phẩm lấy về từ storage
        // lấy ra 1 object sản phẩm có id giống với id người dùng vừa click
        return products.find(product => product.id === id);
    }
    // array cart lúc này chứa các object mà người dùng vừa click
    // lưu lên storage các object sản phẩm mà người dùng vừa click or mua
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        console.log("test 13: ");
        console.log(JSON.parse(localStorage.getItem('cart')))
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    ui.setupAPP();
    // get all products
    // hiển thị danh sách sản phẩm đọc từ các object đưa lên UI
    products.getProducts().then(products => {
        // hiện thị lên UI all sản phẩm or object đọc từ .json
        ui.displayProducts(products);
        console.log("test 4: ");
        console.log(products);
        // lưu các object sản phẩm đọc từ .json lên storage
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});