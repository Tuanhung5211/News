const result = document.getElementById("result");
        function multiply() {
            const num1 = parseInt(document.getElementById("num1").value);
            const num2 = parseInt(document.getElementById("num2").value);

            if (!isNaN(num1) && !isNaN(num2)) {
                result.textContent = `${num1} × ${num2} = ${num1 * num2}`;
            } else {
                result.textContent = "Vui lòng nhập số nguyên hợp lệ!";
            }
        }
        function divide() {
            const num1 = parseInt(document.getElementById("num1").value);
            const num2 = parseInt(document.getElementById("num2").value);

            if (isNaN(num1) || isNaN(num2)) {
                result.textContent = "Vui lòng nhập số nguyên hợp lệ!";
            } else if (num2 === 0) {
                result.textContent = "Không thể chia cho 0!";
            } else {
                result.textContent = `${num1} ÷ ${num2} = ${num1 / num2}`;
            }
        }