function tinhLuong(){
            const luong = parseFloat(document.getElementById("luong").value);
            const heSo = parseFloat(document.getElementById("heSo").value);
            const result = document.getElementById("result");

            if(!isNaN(luong) && !isNaN(heSo)){
                result.textContent =+ (luong * heSo);
            } else {
                result.textContent = "Vui lòng nhập lại thông tin hợp lệ!";
            }
        }