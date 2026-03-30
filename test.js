
// function splitAndOrder(arr, st, en) {
//     let pivot = arr[en];
//     let i = st - 1;
//     for (let j = st; j < en; j++) {
//         if (arr[j] < pivot) {
//             i++;
//             [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
//         }
//     }
//     [arr[i + 1], arr[en]] = [arr[en], arr[i + 1]];
//     return i + 1;
// }
// function quick_sort(arr, st, en) {
//     if (st < en) {
//         let pvIdx = splitAndOrder(arr, st, en)
//         quick_sort(arr, st, pvIdx - 1)
//         quick_sort(arr, pvIdx + 1, en)
//     }

// }
// function bubble_sort(arr) {
//     let n = arr.length
//     for (let i = 0; i < n - 1; i++) {
//         let swap = 0
//         for (let j = 0; j < n - i - 1; j++)
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
//                 swap=1
//             }
//         if(swap===0)return
//     }

// }
// function selection_sort(arr) {
//     let n = arr.length
//     for (let i = 0; i < n - 1; i++) {
//         let mnidx = i, mnval = arr[i]
//         for (let j = i + 1; j < n; j++)
//             if (arr[j] < mnval) {
//                 mnval = arr[j]
//                 mnidx = j;
//             }
//         [arr[i], arr[mnidx]] = [arr[mnidx], arr[i]]
//     }

// }
// function insertoin_sort(arr) {
//     let n = arr.length;
//     for (let i = 1; i < n; i++) {
//         let j = i;
//         while (j > 0 && arr[j] < arr[j - 1]) {
//             [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
//             j--;
//         }
//     }
// }
// function linear_search(arr, val) {
//     for (let i = 0; i < arr.length; i++)
//         if (arr[i] == val) return i
//     return -1;
// }
// function binary_search(arr, val) {
//     let st = 0, en = arr.length-1, mid
//     quick_sort(arr, 0, arr.length-1)
//     while (st <= en) {
//         mid = Math.floor((st + en) / 2)
//         if (arr[mid] < val)
//             st = mid + 1;
//         else if (arr[mid] > val)
//             en = mid - 1;
//         else
//             return mid
//     }
//     return -1;
// }

// let arr = [1, 6, 3, 0]
// quick_sort(arr, 0, arr.length - 1)
// console.log(arr);
// console.log("==============================")
//  arr = [1, 6, 3, 0]
// selection_sort(arr, 0, arr.length - 1)
// console.log(arr);
// console.log("==============================")
//  arr = [1, 6, 3, 0]
// bubble_sort(arr, 0, arr.length - 1)
// console.log(arr);
// console.log("==============================")
//  arr = [1, 6, 3, 0]
// insertoin_sort(arr, 0, arr.length - 1)
// console.log(arr);
// console.log("==============================")
// arr = [1, 6, 3, 0]
// console.log(linear_search(arr,6))
// console.log(linear_search(arr, 55))
// console.log("==============================")
// arr = [1, 6, 3, 0]
// console.log(binary_search(arr, 6))
// console.log(binary_search(arr, 55))



/*
e commerce website  for smart devices 
features


user features
login
register 
view products 
view single products
add to cart 
view cart 
add to favurite list 
view fav list 
make comment on product 
rate product

seller features 
login
register
Crud on products 
analysis for product

admin features
Crud on User 
crud products
analysis for product
analysis for Users
Send Globla Notification

extra 
Send Noticatoin using Socketio on comment 
Send Notification To Seller On sell
Mail Service For Verify Email 
Chat  بس مش شايفه منطقي قوي او ليه لازمة ف نتفق نشوف هنعمله ولا لا 

bonus
use Descriminator in mongo schema 
Login By Google




login 
register 
error handling 
google Oauth
configure Mail service
Cloudinary 
Notification Socket io
Project schema



any read include pagination
Product CRUD 4
User CRUD    4
Search
Filter BY Category
make comment 
Favorite list add-remove 
Cart Add-remove 
Calculate Cost  mybe auto with cart 

*/