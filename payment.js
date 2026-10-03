let selectedDepositMethod = null;
let selectedWithdrawMethod = null;
let amt = 0; // 🔹 Global USD amount, Deposit ও Withdraw উভয়েই ব্যবহার হবে

// ===== Global USD → BDT conversion function =====
function convertUsdToTaka(usdAmt, method){
    if(isNaN(usdAmt) || usdAmt <= 0) return 0;
    const rate = 125; // Binance P2P rate
    let amtInTaka = Math.round(usdAmt * rate);
    // Manual Methods Extra Charge
    if(['bkash','nagad','rocket'].includes(method)){
        let extraCharge = Math.ceil(amtInTaka/1000) * 18;
        amtInTaka += extraCharge;
    }
    return amtInTaka;
}

// ================= Block 1: Toggle Panels + Global Back/Cancel =================


document.querySelectorAll('[data-panel]').forEach(btn => {
    const target = document.getElementById(btn.dataset.panel);
    initBackCancel(target);

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const isHidden = target.classList.contains('hidden');

        // 🔹 toggle logic
        document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        if(isHidden) target.classList.remove('hidden');

        if(!target.dataset.step) target.dataset.step = "0";

        updateBackBtn(target);
        target.querySelector('.cancelBtn').style.display = 'block';

        const t = target.querySelector('.payment-title');
        if(t) t.textContent = selectedDepositMethod || selectedWithdrawMethod || "Select a payment option";
    });
});

document.querySelectorAll('.panel').forEach(p => p.addEventListener('click', e => e.stopPropagation()));
document.addEventListener('click', () => document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden')));

// 🔥 METHOD CLICK = FORCE RESET INPUT
document.querySelectorAll('#depositPanel .methodBtn, #withdrawPanel .methodBtn')
.forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.panel');
        panel.querySelectorAll('input').forEach(i => i.value = '');
    });
});

function initBackCancel(panel){
    if(!panel.querySelector('.backBtn')){
        const backBtn = document.createElement('button');
        backBtn.textContent = '← Back';
        backBtn.classList.add('backBtn');
        backBtn.style.width = '100%';
        backBtn.style.marginBottom = '10px';
        backBtn.style.display = 'none';
        panel.prepend(backBtn);

        backBtn.addEventListener('click', () => {
            let step = parseInt(panel.dataset.step || "0");

            // Step-wise hide/show logic
            if(step === 2){
                panel.querySelectorAll('#depositForm2, #withdrawForm2').forEach(f => f?.classList.add('hidden'));
                panel.querySelectorAll('#depositForm, #withdrawForm').forEach(f => f?.classList.remove('hidden'));
            } else if(step === 1){
                panel.querySelectorAll('#depositForm, #withdrawForm').forEach(f => f?.classList.add('hidden'));
                panel.querySelectorAll('.methodBtn').forEach(b => b.style.display='inline-block');

                const title = panel.querySelector('.payment-title'); 
                if(title) title.textContent = "Select a payment option";
            }

            // Step decrement
            step = Math.max(step - 1, 0);
            panel.dataset.step = step;
            updateBackBtn(panel);

            // 🔹 ❌ ব্যাক দিয়ে panel হাইড হবে না
            // শুধুমাত্র step-wise ফর্ম update হচ্ছে
        });
    }

    if(!panel.querySelector('.cancelBtn')){
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.id = panel.id === 'depositPanel' ? 'cancelDeposit' : 'cancelWithdraw';
        cancelBtn.classList.add('cancelBtn');

        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.width = 'auto';
        cancelBtn.style.margin = '10px auto';
        cancelBtn.style.display = 'block';

        panel.appendChild(cancelBtn);

        cancelBtn.addEventListener('click', () => {
            resetPanel(panel);
            panel.classList.add('hidden'); // ❌ কেবল cancel প্যানেল hide করবে
        });
    }

    if(!panel.querySelector('.payment-title')){
        const title = document.createElement('p');
        title.classList.add('payment-title');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.textContent = "Select a payment option";
        panel.prepend(title);
    }
}

function updateBackBtn(panel){
    const backBtn = panel.querySelector('.backBtn');
    if(!backBtn) return;

    const step = parseInt(panel.dataset.step || "0");
    backBtn.style.display = step > 0 ? 'block' : 'none';
}

function showGlobalBackCancel(panel){
    const backBtn = panel.querySelector('.backBtn');
    const cancelBtn = panel.querySelector('.cancelBtn');
    if(backBtn) backBtn.style.display='block';
    if(cancelBtn) cancelBtn.style.display='block';

    const title = panel.querySelector('.payment-title');
    if(title){
        if(selectedDepositMethod) title.textContent = capitalize(selectedDepositMethod);
        else if(selectedWithdrawMethod) title.textContent = capitalize(selectedWithdrawMethod);
        else title.textContent = "Select a payment option";
    }

    if(panel.querySelector('#depositForm2, #withdrawForm2')) panel.dataset.step = "2";
    else if(selectedDepositMethod || selectedWithdrawMethod) panel.dataset.step = "1";
    else panel.dataset.step = "0";

    updateBackBtn(panel);
}

function resetPanel(panel){
    panel.querySelectorAll('input').forEach(i => i.value='');
    panel.querySelectorAll('#depositForm, #depositForm2, #withdrawForm, #withdrawForm2').forEach(f => f?.classList.add('hidden'));
    panel.querySelectorAll('.methodBtn').forEach(b => b.style.display='inline-block');
    const backBtn = panel.querySelector('.backBtn'); if(backBtn) backBtn.style.display='none';
    const cancelBtn = panel.querySelector('.cancelBtn'); if(cancelBtn) cancelBtn.style.display='none';
    const title = panel.querySelector('.payment-title'); if(title) title.textContent = "Select a payment option";

    selectedDepositMethod = null;
    selectedWithdrawMethod = null;
    amt = 0;

    panel.dataset.step = "0";
}

function capitalize(str){ 
    if(!str) return ''; 
    return str.charAt(0).toUpperCase() + str.slice(1); 
}






// ================= Block 2: Deposit Panel =================

const depositPanel = document.getElementById('depositPanel');

document.querySelectorAll('#depositPanel .methodBtn').forEach(btn =>
    btn.addEventListener('click', ()=>{
        selectedDepositMethod = btn.dataset.method;
        depositPanel.querySelectorAll('.methodBtn').forEach(b=>b.style.display='none');
        showGlobalBackCancel(depositPanel);

        let form = depositPanel.querySelector('#depositForm');
        if(!form){
            form = document.createElement('div');
            form.id = 'depositForm';
            depositPanel.appendChild(form);
        }
        form.classList.remove('hidden');
        const prevAmount = form.querySelector('#depositAmount')?.value || '';
        form.innerHTML = `
            <input type="number" id="depositAmount" placeholder="Enter amount"
            style="margin-bottom:10px; font-family:Verdana, sans-serif; font-size:15px;"
            value="${prevAmount}">
            <button id="submitDepositAmount"
            style="font-family:Verdana, sans-serif; font-size:15px;">Submit Amount</button>
        `;

        document.getElementById('submitDepositAmount').onclick = ()=>{
            const amtInput = document.getElementById('depositAmount');
            const amtStr = amtInput?.value.trim();
            if(!amtStr) return showNotification("Enter amount");
            amt = parseFloat(amtStr); // 🔹 Update global amt
            if(amt < 10) return showNotification("Minimum deposit is $10");
            form.classList.add('hidden');

            // ===== BINANCE QR DISPLAY =====
            if(selectedDepositMethod === 'binance'){
                const dummyCheckoutUrl = `https://pay.binance.com/checkout?amount=${amt}`;
                let qrDiv = depositPanel.querySelector('#binanceQR');
                if(!qrDiv){
                    qrDiv = document.createElement('div');
                    qrDiv.id = 'binanceQR';
                    qrDiv.style.marginTop = '15px';
                    depositPanel.appendChild(qrDiv);
                }
                qrDiv.innerHTML = '';
                QRCode.toCanvas(dummyCheckoutUrl, { width: 200 }, function (error, canvas) {
                    if (error) console.error(error);
                    qrDiv.appendChild(canvas);
                });

                showNotification("Scan QR with Binance App to pay", 4000, "info");

                let linkEl = depositPanel.querySelector('#binanceLink');
                if(!linkEl){
                    linkEl = document.createElement('a');
                    linkEl.id = 'binanceLink';
                    linkEl.target = "_blank";
                    linkEl.style.display = 'block';
                    linkEl.style.marginTop = '10px';
                    depositPanel.appendChild(linkEl);
                }
                linkEl.href = dummyCheckoutUrl;
                linkEl.textContent = "Or open in browser";
                return;
            }

            // ===== Manual Methods (Bkash, Nagad, Rocket) =====
            let form2 = depositPanel.querySelector('#depositForm2');
            if(!form2){
                form2 = document.createElement('div');
                form2.id = 'depositForm2';
                depositPanel.appendChild(form2);
            }
            form2.classList.remove('hidden');

            let methodValue = '';
            switch(selectedDepositMethod){
                case 'bkash': methodValue='01711704696'; break;
                case 'nagad': methodValue='01711704696'; break;
                case 'rocket': methodValue='01711704696'; break;
            }

            const amtInTaka = convertUsdToTaka(amt, selectedDepositMethod);

            form2.innerHTML = `
                <p>Send Money <strong>৳ ${amtInTaka}</strong> to:</p>
                <p style="font-weight:bold">${methodValue}</p>
                <input type="text" id="transactionId"
                placeholder="Enter Transaction ID/Batch"
                style="margin-bottom:10px; font-family:Verdana, sans-serif; font-size:15px;">
                <button id="submitDepositFinal"
                style="font-family:Verdana, sans-serif; font-size:15px;">Submit Deposit</button>
            `;

            showGlobalBackCancel(depositPanel);

            document.getElementById('submitDepositFinal').onclick = ()=>{
                const txnInput = document.getElementById('transactionId');
                const txn = txnInput?.value.trim();
                const errors = [];
                if(!txn) errors.push("Enter Transaction ID/Batch");
                const txnPattern = /^[A-Za-z0-9]+$/;
                if(txn && !txnPattern.test(txn)) errors.push("Wrong Transaction ID");
                const txnLengths = { bkash: 10, nagad: 8, rocket: 10 };
                if(txn && txnPattern.test(txn)){
                    const expectedLength = txnLengths[selectedDepositMethod];
                    if(txn.length !== expectedLength) errors.push("Wrong Trx Format");
                }
                if(errors.length) return showNotification(errors.join(" & "));

                liveBalance += amt;
                updateBalanceUI('live'); 
                refreshDropdownBalances();
                addTransaction("Deposit", selectedDepositMethod, amt, txn);
                showNotification("Deposit Successful",2000,"success");
                resetPanel(depositPanel);
            };
        };
    })
);



// ================= Block 3: Withdraw Panel =================
const withdrawPanel = document.getElementById('withdrawPanel');

document.querySelectorAll('#withdrawPanel .methodBtn').forEach(btn =>
    btn.addEventListener('click', ()=>{
        selectedWithdrawMethod = btn.dataset.method;
        withdrawPanel.querySelectorAll('.methodBtn').forEach(b=>b.style.display='none');
        showGlobalBackCancel(withdrawPanel);

        let form = withdrawPanel.querySelector('#withdrawForm');
        if(!form){
            form = document.createElement('div'); 
            form.id = 'withdrawForm';
            withdrawPanel.appendChild(form);
        }
        form.classList.remove('hidden');

        const prevAmount = form.querySelector('#withdrawAmount')?.value || '';
        let prevMethodValue = '';
        switch(selectedWithdrawMethod){
            case 'bkash': case 'nagad': case 'rocket': prevMethodValue = form.querySelector('#withdrawPhone')?.value || ''; break;
            case 'binance': prevMethodValue = form.querySelector('#withdrawWallet')?.value || ''; break;
        }

        const withdrawPlaceholders = {
            bkash: 'Enter your personal bkash number',
            nagad: 'Enter your personal nagad number',
            rocket: 'Enter your personal rocket number',
            binance: 'Enter your Binance wallet address'
        };
        const inputStyle = 'margin-bottom:10px; font-family:Verdana, sans-serif; font-size:15px; letter-spacing:0px;';
        let methodFieldHTML = '';
        if(['bkash','nagad','rocket'].includes(selectedWithdrawMethod)){
            methodFieldHTML = `<input type="text" id="withdrawPhone" placeholder="${withdrawPlaceholders[selectedWithdrawMethod]}" style="${inputStyle}" value="${prevMethodValue}">`;
        } else if(selectedWithdrawMethod === 'binance'){
            methodFieldHTML = `<input type="text" id="withdrawWallet" placeholder="${withdrawPlaceholders[selectedWithdrawMethod]}" style="${inputStyle}" value="${prevMethodValue}">`;
        }

        // Withdraw Form HTML (Taka display initially empty)
        form.innerHTML = `
            <p id="withdrawTakaDisplay" style="font-weight:bold; margin-bottom:10px;"></p>
            <input type="number" id="withdrawAmount" placeholder="Enter amount in USD" style="${inputStyle}" value="${prevAmount}">
            ${methodFieldHTML}
            <button id="submitWithdrawFinal" style="${inputStyle}">Submit Withdraw</button>
        `;

        // Update ৳ display above input — only for manual methods
        const withdrawAmtInput = document.getElementById('withdrawAmount');
        const withdrawTakaDisplay = document.getElementById('withdrawTakaDisplay');
        withdrawAmtInput.addEventListener('input', ()=>{
            const amtVal = parseFloat(withdrawAmtInput.value);
            if(!isNaN(amtVal) && amtVal >= 0){
                amt = amtVal; // Update global amt
                if(['bkash','nagad','rocket'].includes(selectedWithdrawMethod)){
                    const amtInTaka = convertUsdToTaka(amt, selectedWithdrawMethod);
                    withdrawTakaDisplay.textContent = `Equivalent: ৳ ${amtInTaka}`;
                } else {
                    withdrawTakaDisplay.textContent = ''; // Binance won't show BDT
                }
            } else {
                withdrawTakaDisplay.textContent = '';
                amt = 0;
            }
        });

        // ===== Withdraw Validation & Submission =====
        document.getElementById('submitWithdrawFinal').onclick = ()=>{
            const methodInput = ['bkash','nagad','rocket'].includes(selectedWithdrawMethod) ? document.getElementById('withdrawPhone') :
                                selectedWithdrawMethod==='binance' ? document.getElementById('withdrawWallet') : null;
            const val = methodInput?.value.trim();

            if(!amt) return showNotification(withdrawAmtInput.placeholder || "Enter amount");

            if(liveBalance !== undefined && amt > Math.round(liveBalance*100)/100){
                return showNotification("Insufficient balance");
            }

            const errors = [];
            if(amt < 10) errors.push("Minimum withdraw is $10");
            if(!val) errors.push(methodInput?.placeholder || "Enter method info");

            if(val && ['bkash','nagad','rocket'].includes(selectedWithdrawMethod)){
                if(!/^\d{11}$/.test(val)) errors.push("Invalid type ! " + methodInput.placeholder);
            }

            if(val && selectedWithdrawMethod === 'binance'){
                if(!/^\d+$/.test(val) || val.length < 9){
                    errors.push("Invalid type ! " + methodInput.placeholder);
                }
            }

            if(errors.length) return showNotification(errors.join(" & "));

            liveBalance -= amt;
            updateBalanceUI('live'); 
            refreshDropdownBalances();
            addTransaction("Withdraw", selectedWithdrawMethod, amt, val);
            showNotification("Withdraw Submitted",2000,"success");
            resetPanel(withdrawPanel);
        };
    })
);