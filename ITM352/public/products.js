// Vincent Wang

// Creates array of products for hydroflask
var hydroflask = [
    {
        "name": "20 oz Wide Mouth Hydroflask",
        "price": 38.00,
        "image": "hydroflask1.jpg"
    },
    {
        "name": "32 oz Wide Mouth Hydroflask",
        "price": 45.00,
        "image": "hydroflask2.jpg"
    },
    {
        "name": "40 oz Wide Mouth Hydroflask",
        "price": 50.00,
        "image": "hydroflask3.jpg"
    },
    {
        "name": "64 oz Wide Mouth Hydroflask",
        "price": 65.00,
        "image": "hydroflask4.jpg"
    }                                                            
]

// Creates array of products for pogo
var pogo = [
    {
        "name": "12 oz Kids Stainless Steel Pogo",
        "price": 10.00,
        "image": "pogo1.png"
    },
    {
        "name": "18 oz Soft Straw Stainless Steel Pogo",
        "price": 15.00,
        "image": "pogo2.png"
    },
    {
        "name": "26 oz Soft Straw Stainless Steel Pogo",
        "price": 20.00,
        "image": "pogo3.png"
    }                                                           
]

// Creates array of products for fidus
var fidus = [
    {
        "name": "32 oz Leakproof Tritan Fidus",
        "price": 15.00,
        "image": "fidus1.jpg"
    },
    {
        "name": "Large Half Gallon/64 oz Motivational Fidus",
        "price": 20.00,
        "image": "fidus2.jpg"
    },
    {
        "name": "1 Gallon Motivational Fidus",
        "price": 25.00,
        "image": "fidus3.jpg"
    }                                                      
]

// Creates array of products for hydromate
var hydromate = [
    {
        "name": "32 oz with Straw Hydromate",
        "price": 20.00,
        "image": "hydromate1.jpg"
    },
    {
        "name": "64 oz with Straw Hydromate",
        "price": 25.00,
        "image": "hydromate2.jpg"
    },
    {
        "name": "128 oz with Straw Hydromate",
        "price": 30.00,
        "image": "hydromate3.jpg"
    }                                                            
]

// Creates array of products that contains all products
var products =
    {
        "hydroflask": hydroflask,
        "pogo": pogo,
        "fidus": fidus, 
        "hydromate": hydromate
    }
    
if(typeof module != 'undefined') {
     module.exports.products = products;
    }
