document.addEventListener("DOMContentLoaded", function () {

// ==============================
// ELEMENTS
// ==============================

const homeBtn = document.getElementById("homeBtn");

const topUserName = document.getElementById("topUserName");
const topUserId = document.getElementById("topUserId");
const topStatus = document.getElementById("topStatus");

const message = document.getElementById("message");

const accountSection = document.getElementById("accountSection");
const guestSection = document.getElementById("guestSection");
const profileSection = document.getElementById("profileSection");
const logoutArea = document.getElementById("logoutArea");

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const otpView = document.getElementById("otpView");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginSubmit");

const showRegister = document.getElementById("showRegister");
const backToLogin = document.getElementById("backToLogin");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword =
    document.getElementById("registerConfirmPassword");

const registerRules =
    document.getElementById("registerRules");

const registerSubmit =
    document.getElementById("registerSubmit");

const emailOtp =
    document.getElementById("emailOtp");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const resendOtpBtn =
    document.getElementById("resendOtpBtn");

const cancelOtpBtn =
    document.getElementById("cancelOtpBtn");

const guestRules =
    document.getElementById("guestRules");

const guestJoinBtn =
    document.getElementById("guestJoinBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileId =
    document.getElementById("profileId");

const profileEmail =
    document.getElementById("profileEmail");

const profileJoined =
    document.getElementById("profileJoined");

const changeEmailBtn =
    document.getElementById("changeEmailBtn");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");


// ==============================
// DEMO & LIVE BALANCE
// ==============================

const demoBalanceBtn =
    document.getElementById("demoBalanceBtn");

const liveBalanceBtn =
    document.getElementById("liveBalanceBtn");

let demoBalance =
    parseFloat(
        localStorage.getItem("demoBalance")
    ) || 10;

let liveBalance =
    parseFloat(
        localStorage.getItem("liveBalance")
    ) || 0;


// ==============================
// BALANCE FORMAT
// ==============================

function formatBalance(value) {

    return (
        Math.round(value * 100) / 100
    )
    .toFixed(2)
    .replace(/\.00$/, "");
}


// ==============================
// UPDATE BALANCE UI
// ==============================

function updateBalanceUI() {

    if (demoBalanceBtn) {

        demoBalanceBtn.textContent =
            `Demo Balance: $${formatBalance(demoBalance)}`;
    }

    if (liveBalanceBtn) {

        liveBalanceBtn.textContent =
            `Live Balance: $${formatBalance(liveBalance)}`;
    }
}


// ==============================
// BALANCE BUTTON VISIBILITY
// ==============================

function updateBalanceButtonVisibility() {

    const accountType =
        localStorage.getItem(
            "accountType"
        );

    const userId =
        localStorage.getItem(
            "userId"
        );

    const loggedIn =
        (
            accountType === "Account" ||
            accountType === "Guest"
        ) &&
        !!userId;


    if (demoBalanceBtn) {

        demoBalanceBtn.classList.toggle(
            "hidden",
            !loggedIn
        );
    }


    if (liveBalanceBtn) {

        liveBalanceBtn.classList.toggle(
            "hidden",
            !loggedIn
        );
    }
}


// ==============================
// INITIAL BALANCE UI
// ==============================

updateBalanceUI();

updateBalanceButtonVisibility();


// ==============================
// BALANCE POLLING
// ==============================

setInterval(function () {

    const demo =
        parseFloat(
            localStorage.getItem(
                "demoBalance"
            )
        ) || 10;

    const live =
        parseFloat(
            localStorage.getItem(
                "liveBalance"
            )
        ) || 0;


    if (
        demo !== demoBalance ||
        live !== liveBalance
    ) {

        demoBalance = demo;

        liveBalance = live;

        updateBalanceUI();
    }


    updateBalanceButtonVisibility();

}, 500);


// ==============================
// ADD DEMO BALANCE
// ==============================

window.addDemo = function (amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount)) {
        return;
    }

    demoBalance += amount;

    localStorage.setItem(
        "demoBalance",
        demoBalance
    );

    updateBalanceUI();

    addTransaction(
        "Demo added",
        amount
    );
};


// ==============================
// ADD LIVE BALANCE
// ==============================

window.addLive = function (amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount)) {
        return;
    }

    liveBalance += amount;

    localStorage.setItem(
        "liveBalance",
        liveBalance
    );

    updateBalanceUI();

    addTransaction(
        "Live added",
        amount
    );
};


// ==============================
// TRANSACTION HISTORY
// ==============================

const transactionList =
    document.getElementById(
        "transactionList"
    );


function addTransaction(type, amount) {

    if (!transactionList) {
        return;
    }


    if (
        transactionList.children[0] &&
        transactionList.children[0].textContent ===
        "No transactions yet."
    ) {

        transactionList.innerHTML = "";
    }


    const li =
        document.createElement("li");

    li.textContent =
        `${type}: $${formatBalance(amount)}`;

    transactionList.appendChild(li);
}


// ==============================
// DYNAMIC NAME EDIT BUTTON
// ==============================

let changeNameBtn = null;

function createNameEditButton() {

    if (changeNameBtn) return;

    changeNameBtn = document.createElement("button");

    changeNameBtn.type = "button";
    changeNameBtn.className = "profile-action-btn";
    changeNameBtn.textContent = "Change";
    changeNameBtn.style.marginLeft = "8px";

    profileName.parentElement.appendChild(changeNameBtn);

    changeNameBtn.addEventListener("click", function () {

        const currentName =
            localStorage.getItem("registeredName") ||
            profileName.textContent.trim();

        const newName = prompt(
            "Enter your new name:",
            currentName
        );

        if (newName === null) {
            return;
        }

        const name =
            newName.trim();

        if (name === "") {

            showMessage(
                "Name cannot be empty.",
                "error"
            );

            return;
        }

        if (name.length < 2) {

            showMessage(
                "Name must contain at least 2 characters.",
                "error"
            );

            return;
        }

        localStorage.setItem(
            "registeredName",
            name
        );

        localStorage.setItem(
            "userName",
            name
        );

        profileName.textContent =
            name;

        topUserName.textContent =
            name;

        showMessage(
            "Name changed successfully.",
            "success"
        );
    });
}


// ==============================
// PROFILE ROW CONTROL
// ==============================

const nameRow =
    profileName?.closest(".info-row");

const emailRow =
    profileEmail?.closest(".info-row");

const passwordRow =
    changePasswordBtn?.closest(".info-row");

const recoveryRow =
    forgotPasswordBtn?.closest(".info-row");

const nameLabel =
    nameRow?.querySelector(".info-label");


function showAccountProfile() {

    if (nameRow) {
        nameRow.style.display = "";
    }

    if (emailRow) {
        emailRow.style.display = "";
    }

    if (passwordRow) {
        passwordRow.style.display = "";
    }

    if (recoveryRow) {
        recoveryRow.style.display = "";
    }

    if (nameLabel) {
        nameLabel.textContent = "User Name";
    }

    createNameEditButton();

    if (changeNameBtn) {
        changeNameBtn.style.display = "inline-block";
    }

    if (changeEmailBtn) {
        changeEmailBtn.style.display = "inline-block";
    }

    if (changePasswordBtn) {
        changePasswordBtn.style.display = "inline-block";
    }

    if (forgotPasswordBtn) {
        forgotPasswordBtn.style.display = "inline-block";
    }
}


function showGuestProfile() {

    // User Name row becomes Account Type

    if (nameRow) {
        nameRow.style.display = "";
    }

    if (nameLabel) {
        nameLabel.textContent = "Account Type";
    }

    profileName.textContent = "Guest";

    if (changeNameBtn) {
        changeNameBtn.style.display = "none";
    }

    // Hide Account-only rows

    if (emailRow) {
        emailRow.style.display = "none";
    }

    if (passwordRow) {
        passwordRow.style.display = "none";
    }

    if (recoveryRow) {
        recoveryRow.style.display = "none";
    }
}


// ==============================
// MESSAGE
// ==============================

function clearMessage() {

    message.textContent = "";
    message.className = "message";
    message.style.color = "";
}


function showMessage(text, type = "error") {

    message.textContent = text;
    message.className =
        "message " + type;

    if (
        type === "error" ||
        type === "warning"
    ) {
        message.style.color = "#e53935";
    }

    if (type === "success") {
        message.style.color = "#2e7d32";
    }
}


// ==============================
// FIELD WARNING
// ==============================

function createWarning(input, text) {

    clearWarning(input);

    const warning =
        document.createElement("div");

    warning.className =
        "field-warning";

    warning.textContent =
        text;

    warning.style.color =
        "#e53935";

    warning.style.fontSize =
        "13px";

    warning.style.marginTop =
        "6px";

    warning.style.lineHeight =
        "1.4";

    if (input.type === "checkbox") {

        input.closest(".check-row")
            ?.appendChild(warning);

    } else {

        input.parentElement
            .appendChild(warning);
    }

    input.classList.add(
        "input-error"
    );

    input.style.borderColor =
        "#e53935";
}


function clearWarning(input) {

    if (!input) return;

    input.classList.remove(
        "input-error"
    );

    input.style.borderColor = "";

    let parent;

    if (input.type === "checkbox") {

        parent =
            input.closest(".check-row");

    } else {

        parent =
            input.parentElement;
    }

    if (!parent) return;

    const oldWarning =
        parent.querySelector(
            ".field-warning"
        );

    if (oldWarning) {
        oldWarning.remove();
    }
}


function clearAllWarnings() {

    document
        .querySelectorAll(".field-warning")
        .forEach(function (warning) {
            warning.remove();
        });

    document
        .querySelectorAll(".input-error")
        .forEach(function (input) {

            input.classList.remove(
                "input-error"
            );

            input.style.borderColor = "";
        });
}


// ==============================
// EMAIL VALIDATION
// ==============================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


// ==============================
// UNIQUE USER ID
//
// AC-e4636435
// AC-f4636365
// AC-e4625665
// AC-4f536888
//
// AC- + 8 characters
// Mostly numbers
// ==============================

function generateUserId() {

    const letters =
        "abcdefghijklmnopqrstuvwxyz";

    let id;
    let exists = true;

    while (exists) {

        let code = "";

        // প্রথম character:
        // letter অথবা number

        const firstCharacters =
            "abcdefghijklmnopqrstuvwxyz0123456789";

        code += firstCharacters.charAt(
            Math.floor(
                Math.random() *
                firstCharacters.length
            )
        );

        // বাকি 7 character:
        // বেশিরভাগ সংখ্যা

        for (let i = 1; i < 8; i++) {

            // প্রায় 80% ক্ষেত্রে সংখ্যা
            const useNumber =
                Math.random() < 0.80;

            if (useNumber) {

                code +=
                    Math.floor(
                        Math.random() * 10
                    );

            } else {

                code +=
                    letters.charAt(
                        Math.floor(
                            Math.random() *
                            letters.length
                        )
                    );
            }
        }

        id =
            "AC-" + code;

        exists = false;

        if (
            localStorage.getItem(
                "registeredUserId"
            ) === id
        ) {
            exists = true;
        }

        if (
            localStorage.getItem(
                "userId"
            ) === id
        ) {
            exists = true;
        }
    }

    return id;
}


// ==============================
// GUEST ID
// ==============================

function generateGuestId() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 8; i++) {

        code += characters.charAt(
            Math.floor(
                Math.random() *
                characters.length
            )
        );
    }

    return "GUEST-" + code;
}


// ==============================
// OTP
// ==============================

function generateOtp() {

    return String(
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );
}


// ==============================
// DEMO OTP
// ==============================

function sendOtpToEmail(email) {

    const otp =
        generateOtp();

    localStorage.setItem(
        "pendingOtp",
        otp
    );

    localStorage.setItem(
        "pendingOtpEmail",
        email
    );

    localStorage.setItem(
        "otpCreatedAt",
        Date.now()
    );

    console.log(
        "DEMO OTP for " +
        email +
        ": " +
        otp
    );

    return otp;
}


function isOtpValid(otp) {

    const savedOtp =
        localStorage.getItem(
            "pendingOtp"
        );

    const createdAt =
        Number(
            localStorage.getItem(
                "otpCreatedAt"
            )
        );

    if (
        !savedOtp ||
        !createdAt
    ) {
        return false;
    }

    const fiveMinutes =
        5 * 60 * 1000;

    if (
        Date.now() -
        createdAt >
        fiveMinutes
    ) {

        clearOtp();

        return false;
    }

    return otp === savedOtp;
}


function clearOtp() {

    localStorage.removeItem(
        "pendingOtp"
    );

    localStorage.removeItem(
        "pendingOtpEmail"
    );

    localStorage.removeItem(
        "otpCreatedAt"
    );
}


// ==============================
// SHOW LOGIN
// ==============================

function showLogin() {

    loginView.classList.remove(
        "hidden"
    );

    registerView.classList.add(
        "hidden"
    );

    otpView.classList.add(
        "hidden"
    );

    clearAllWarnings();
    clearMessage();
}


// ==============================
// SHOW REGISTER
// ==============================

function showRegisterView() {

    loginView.classList.add(
        "hidden"
    );

    registerView.classList.remove(
        "hidden"
    );

    otpView.classList.add(
        "hidden"
    );

    clearAllWarnings();
    clearMessage();
}


// ==============================
// RESET
// ==============================

function resetPage() {

    topUserName.textContent =
        "Account";

    topUserId.textContent =
        "Not joined";

    topStatus.textContent =
        "Guest";

    topStatus.style.cursor =
        "pointer";

    accountSection.classList.remove(
        "hidden"
    );

    loginView.classList.remove(
        "hidden"
    );

    registerView.classList.add(
        "hidden"
    );

    otpView.classList.add(
        "hidden"
    );

    guestSection.classList.add(
        "hidden"
    );

    profileSection.classList.add(
        "hidden"
    );

    logoutArea.classList.add(
        "hidden"
    );

    clearAllWarnings();
    clearMessage();

    loginEmail.value = "";
    loginPassword.value = "";

    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    registerConfirmPassword.value = "";

    registerRules.checked =
        false;

    guestRules.checked =
        false;

    emailOtp.value = "";

    // Restore account profile layout

    showAccountProfile();

    updateBalanceButtonVisibility();
}


// ==============================
// LOAD SAVED ACCOUNT
// ==============================

function loadSavedAccount() {

    const accountType =
        localStorage.getItem(
            "accountType"
        );

    const userId =
        localStorage.getItem(
            "userId"
        );

    const userName =
        localStorage.getItem(
            "userName"
        );

    const accountStatus =
        localStorage.getItem(
            "accountStatus"
        );

    const joined =
        localStorage.getItem(
            "joinedDate"
        );

    if (
        !accountType ||
        !userId
    ) {

        resetPage();
        return;
    }

    topUserName.textContent =
        userName || "User";

    topUserId.textContent =
        userId;

    topStatus.textContent =
        accountStatus || "Active";

    topStatus.style.cursor =
        "default";

    accountSection.classList.add(
        "hidden"
    );

    guestSection.classList.add(
        "hidden"
    );

    profileSection.classList.remove(
        "hidden"
    );

    logoutArea.classList.remove(
        "hidden"
    );


    // ==========================
    // GUEST
    // ==========================

    if (
        accountType === "Guest"
    ) {

        profileId.textContent =
            userId;

        profileJoined.textContent =
            joined ||
            "Previously joined";

        showGuestProfile();

        updateBalanceButtonVisibility();

        return;
    }


    // ==========================
    // ACCOUNT
    // ==========================

    profileName.textContent =
        localStorage.getItem(
            "registeredName"
        ) ||
        userName ||
        "—";

    profileId.textContent =
        userId;

    profileEmail.textContent =
        localStorage.getItem(
            "registeredEmail"
        ) ||
        "—";

    profileJoined.textContent =
        localStorage.getItem(
            "registeredJoinedDate"
        ) ||
        joined ||
        "Previously joined";

    showAccountProfile();

    updateBalanceButtonVisibility();
}


// ==============================
// TOP GUEST
// ==============================

topStatus.addEventListener(
    "click",
    function () {

        if (
            topStatus.textContent.trim() !==
            "Guest"
        ) {
            return;
        }

        accountSection.classList.add(
            "hidden"
        );

        profileSection.classList.add(
            "hidden"
        );

        logoutArea.classList.add(
            "hidden"
        );

        guestSection.classList.remove(
            "hidden"
        );

        clearMessage();
        clearAllWarnings();

        window.scrollTo({
            top:
                guestSection.offsetTop - 20,
            behavior: "smooth"
        });
    }
);


// ==============================
// REGISTER VIEW
// ==============================

showRegister.addEventListener(
    "click",
    function () {

        showRegisterView();
    }
);


backToLogin.addEventListener(
    "click",
    function () {

        showLogin();
    }
);


// ==============================
// REGISTRATION
// ==============================

registerSubmit.addEventListener(
    "click",
    function () {

        clearAllWarnings();
        clearMessage();

        let valid = true;


        // NAME

        if (
            registerName.value.trim() === ""
        ) {

            createWarning(
                registerName,
                "Please enter your full name."
            );

            valid = false;
        }


        // EMAIL

        const email =
            registerEmail.value
                .trim()
                .toLowerCase();

        if (email === "") {

            createWarning(
                registerEmail,
                "Please enter your email."
            );

            valid = false;

        } else if (
            !isValidEmail(email)
        ) {

            createWarning(
                registerEmail,
                "Please enter a valid email address."
            );

            valid = false;
        }


        // PASSWORD

        if (
            registerPassword.value === ""
        ) {

            createWarning(
                registerPassword,
                "Please enter a password."
            );

            valid = false;

        } else if (
            registerPassword.value.length < 6
        ) {

            createWarning(
                registerPassword,
                "Password must be at least 6 characters."
            );

            valid = false;
        }


        // CONFIRM PASSWORD

        if (
            registerConfirmPassword.value === ""
        ) {

            createWarning(
                registerConfirmPassword,
                "Please confirm your password."
            );

            valid = false;

        } else if (
            registerConfirmPassword.value !==
            registerPassword.value
        ) {

            createWarning(
                registerConfirmPassword,
                "Passwords do not match."
            );

            valid = false;
        }


        // RULES

        if (
            !registerRules.checked
        ) {

            createWarning(
                registerRules,
                "Please agree to the Rules & Conditions."
            );

            valid = false;
        }


        if (!valid) {

            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }


        // EXISTING EMAIL

        const existingEmail =
            localStorage.getItem(
                "registeredEmail"
            );

        if (
            existingEmail &&
            existingEmail.toLowerCase() ===
            email
        ) {

            createWarning(
                registerEmail,
                "An account with this email already exists."
            );

            showMessage(
                "This email is already registered.",
                "error"
            );

            return;
        }


        // SEND OTP

        sendOtpToEmail(email);

        localStorage.setItem(
            "pendingRegisterName",
            registerName.value.trim()
        );

        localStorage.setItem(
            "pendingRegisterEmail",
            email
        );

        localStorage.setItem(
            "pendingRegisterPassword",
            registerPassword.value
        );


        registerView.classList.add(
            "hidden"
        );

        loginView.classList.add(
            "hidden"
        );

        otpView.classList.remove(
            "hidden"
        );

        emailOtp.value = "";

        clearAllWarnings();

        showMessage(
            "A verification OTP has been sent to your email.",
            "success"
        );
    }
);


// ==============================
// VERIFY OTP
// ==============================

verifyOtpBtn.addEventListener(
    "click",
    function () {

        clearAllWarnings();
        clearMessage();

        const otp =
            emailOtp.value.trim();

        if (otp === "") {

            createWarning(
                emailOtp,
                "Please enter the OTP code."
            );

            return;
        }

        if (
            !/^\d{6}$/.test(otp)
        ) {

            createWarning(
                emailOtp,
                "OTP must contain 6 digits."
            );

            return;
        }

        if (
            !isOtpValid(otp)
        ) {

            createWarning(
                emailOtp,
                "Invalid or expired OTP."
            );

            showMessage(
                "The OTP is invalid or expired.",
                "error"
            );

            return;
        }


        const name =
            localStorage.getItem(
                "pendingRegisterName"
            );

        const email =
            localStorage.getItem(
                "pendingRegisterEmail"
            );

        const password =
            localStorage.getItem(
                "pendingRegisterPassword"
            );


        if (
            !name ||
            !email ||
            !password
        ) {

            showMessage(
                "Registration session expired. Please register again.",
                "error"
            );

            showRegisterView();

            return;
        }


        // CREATE UNIQUE ID

        const userId =
            generateUserId();

        const joinedDate =
            new Date()
                .toLocaleDateString();


        // SAVE ACCOUNT

        localStorage.setItem(
            "registeredName",
            name
        );

        localStorage.setItem(
            "registeredEmail",
            email
        );

        localStorage.setItem(
            "registeredPassword",
            password
        );

        localStorage.setItem(
            "registeredUserId",
            userId
        );

        localStorage.setItem(
            "registeredJoinedDate",
            joinedDate
        );

        localStorage.setItem(
            "emailVerified",
            "true"
        );


        // CURRENT SESSION

        localStorage.setItem(
            "accountType",
            "Account"
        );

        localStorage.setItem(
            "userName",
            name
        );

        localStorage.setItem(
            "userId",
            userId
        );

        localStorage.setItem(
            "accountStatus",
            "Active"
        );

        localStorage.setItem(
            "joinedDate",
            joinedDate
        );


        // CLEAR PENDING

        localStorage.removeItem(
            "pendingRegisterName"
        );

        localStorage.removeItem(
            "pendingRegisterEmail"
        );

        localStorage.removeItem(
            "pendingRegisterPassword"
        );

        clearOtp();


        // SHOW PROFILE

        topUserName.textContent =
            name;

        topUserId.textContent =
            userId;

        topStatus.textContent =
            "Active";

        topStatus.style.cursor =
            "default";

        accountSection.classList.add(
            "hidden"
        );

        guestSection.classList.add(
            "hidden"
        );

        profileSection.classList.remove(
            "hidden"
        );

        logoutArea.classList.remove(
            "hidden"
        );

        profileName.textContent =
            name;

        profileId.textContent =
            userId;

        profileEmail.textContent =
            email;

        profileJoined.textContent =
            joinedDate;

        showAccountProfile();

        updateBalanceButtonVisibility();

        showMessage(
            "Email verified. Registration successful.",
            "success"
        );
    }
);


// ==============================
// RESEND OTP
// ==============================

resendOtpBtn.addEventListener(
    "click",
    function () {

        clearAllWarnings();
        clearMessage();

        const email =
            localStorage.getItem(
                "pendingRegisterEmail"
            );

        if (!email) {

            showMessage(
                "Registration session expired.",
                "error"
            );

            showRegisterView();
            return;
        }

        sendOtpToEmail(email);

        emailOtp.value = "";

        showMessage(
            "A new OTP has been generated.",
            "success"
        );
    }
);


// ==============================
// CANCEL OTP
// ==============================

cancelOtpBtn.addEventListener(
    "click",
    function () {

        clearOtp();

        localStorage.removeItem(
            "pendingRegisterName"
        );

        localStorage.removeItem(
            "pendingRegisterEmail"
        );

        localStorage.removeItem(
            "pendingRegisterPassword"
        );

        emailOtp.value = "";

        showRegisterView();
    }
);


// ==============================
// LOGIN
// ==============================

loginSubmit.addEventListener(
    "click",
    function () {

        clearAllWarnings();
        clearMessage();

        let valid = true;

        const email =
            loginEmail.value
                .trim()
                .toLowerCase();


        if (email === "") {

            createWarning(
                loginEmail,
                "Please enter your email."
            );

            valid = false;

        } else if (
            !isValidEmail(email)
        ) {

            createWarning(
                loginEmail,
                "Please enter a valid email address."
            );

            valid = false;
        }


        if (
            loginPassword.value === ""
        ) {

            createWarning(
                loginPassword,
                "Please enter your password."
            );

            valid = false;
        }


        if (!valid) {

            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }


        const savedEmail =
            localStorage.getItem(
                "registeredEmail"
            );

        const savedPassword =
            localStorage.getItem(
                "registeredPassword"
            );

        const savedName =
            localStorage.getItem(
                "registeredName"
            );

        const savedId =
            localStorage.getItem(
                "registeredUserId"
            );

        const verified =
            localStorage.getItem(
                "emailVerified"
            );


        if (
            !savedEmail ||
            !savedPassword ||
            !savedId
        ) {

            createWarning(
                loginEmail,
                "No registered account was found."
            );

            showMessage(
                "Please create an account first.",
                "error"
            );

            return;
        }


        if (
            verified !== "true"
        ) {

            createWarning(
                loginEmail,
                "This email has not been verified."
            );

            return;
        }


        if (
            email !==
            savedEmail.toLowerCase()
        ) {

            createWarning(
                loginEmail,
                "Email address is incorrect."
            );

            showMessage(
                "Login information is incorrect.",
                "error"
            );

            return;
        }


        if (
            loginPassword.value !==
            savedPassword
        ) {

            createWarning(
                loginPassword,
                "Password is incorrect."
            );

            showMessage(
                "Login information is incorrect.",
                "error"
            );

            return;
        }


        // LOGIN SUCCESS

        const joinedDate =
            localStorage.getItem(
                "registeredJoinedDate"
            ) ||
            new Date()
                .toLocaleDateString();


        localStorage.setItem(
            "accountType",
            "Account"
        );

        localStorage.setItem(
            "userName",
            savedName
        );

        localStorage.setItem(
            "userId",
            savedId
        );

        localStorage.setItem(
            "accountStatus",
            "Active"
        );

        localStorage.setItem(
            "joinedDate",
            joinedDate
        );


        topUserName.textContent =
            savedName;

        topUserId.textContent =
            savedId;

        topStatus.textContent =
            "Active";

        topStatus.style.cursor =
            "default";


        accountSection.classList.add(
            "hidden"
        );

        guestSection.classList.add(
            "hidden"
        );

        profileSection.classList.remove(
            "hidden"
        );

        logoutArea.classList.remove(
            "hidden"
        );


        profileName.textContent =
            savedName;

        profileId.textContent =
            savedId;

        profileEmail.textContent =
            savedEmail;

        profileJoined.textContent =
            joinedDate;

        showAccountProfile();

        updateBalanceButtonVisibility();


        showMessage(
            "Login successful.",
            "success"
        );
    }
);


// ==============================
// GUEST JOIN
// ==============================

guestJoinBtn.addEventListener(
    "click",
    function () {

        clearAllWarnings();
        clearMessage();

        if (
            !guestRules.checked
        ) {

            createWarning(
                guestRules,
                "Please agree to the Rules & Conditions."
            );

            showMessage(
                "Please agree to the Rules & Conditions.",
                "error"
            );

            return;
        }


        const guestId =
            generateGuestId();

        const joinedDate =
            new Date()
                .toLocaleDateString();


        localStorage.setItem(
            "accountType",
            "Guest"
        );

        localStorage.setItem(
            "userName",
            "Guest"
        );

        localStorage.setItem(
            "userId",
            guestId
        );

        localStorage.setItem(
            "accountStatus",
            "Active"
        );

        localStorage.setItem(
            "joinedDate",
            joinedDate
        );


        topUserName.textContent =
            "Guest";

        topUserId.textContent =
            guestId;

        topStatus.textContent =
            "Active";

        topStatus.style.cursor =
            "default";


        accountSection.classList.add(
            "hidden"
        );

        guestSection.classList.add(
            "hidden"
        );

        profileSection.classList.remove(
            "hidden"
        );

        logoutArea.classList.remove(
            "hidden"
        );


        profileId.textContent =
            guestId;

        profileJoined.textContent =
            joinedDate;

        showGuestProfile();

        guestRules.checked =
            false;

        updateBalanceButtonVisibility();


        showMessage(
            "You have joined as a Guest.",
            "success"
        );
    }
);


// ==============================
// CHANGE EMAIL
// ==============================

if (changeEmailBtn) {

    changeEmailBtn.addEventListener(
        "click",
        function () {

            const currentEmail =
                localStorage.getItem(
                    "registeredEmail"
                );

            const newEmailInput =
                prompt(
                    "Enter your new email:",
                    currentEmail || ""
                );

            if (
                newEmailInput === null
            ) {
                return;
            }

            const newEmail =
                newEmailInput
                    .trim()
                    .toLowerCase();


            if (
                !isValidEmail(newEmail)
            ) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (
                newEmail ===
                currentEmail.toLowerCase()
            ) {

                showMessage(
                    "This is already your current email.",
                    "error"
                );

                return;
            }


            // Generate OTP

            const otp =
                generateOtp();

            localStorage.setItem(
                "changeEmailOtp",
                otp
            );

            localStorage.setItem(
                "changeEmailOtpCreatedAt",
                Date.now()
            );

            localStorage.setItem(
                "pendingNewEmail",
                newEmail
            );


            console.log(
                "DEMO CHANGE EMAIL OTP for " +
                newEmail +
                ": " +
                otp
            );


            const enteredOtp =
                prompt(
                    "A demo OTP has been generated.\n\nCheck the browser Console for the OTP.\n\nEnter OTP:",
                    ""
                );


            if (
                enteredOtp === null
            ) {
                return;
            }


            const savedOtp =
                localStorage.getItem(
                    "changeEmailOtp"
                );

            const createdAt =
                Number(
                    localStorage.getItem(
                        "changeEmailOtpCreatedAt"
                    )
                );


            if (
                !savedOtp ||
                Date.now() -
                createdAt >
                5 * 60 * 1000
            ) {

                localStorage.removeItem(
                    "changeEmailOtp"
                );

                localStorage.removeItem(
                    "pendingNewEmail"
                );

                showMessage(
                    "OTP expired. Please try again.",
                    "error"
                );

                return;
            }


            if (
                enteredOtp.trim() !==
                savedOtp
            ) {

                showMessage(
                    "Invalid OTP.",
                    "error"
                );

                return;
            }


            const finalEmail =
                localStorage.getItem(
                    "pendingNewEmail"
                );


            localStorage.setItem(
                "registeredEmail",
                finalEmail
            );


            profileEmail.textContent =
                finalEmail;


            localStorage.removeItem(
                "changeEmailOtp"
            );

            localStorage.removeItem(
                "changeEmailOtpCreatedAt"
            );

            localStorage.removeItem(
                "pendingNewEmail"
            );


            showMessage(
                "Email changed successfully.",
                "success"
            );
        }
    );
}


// ==============================
// CHANGE PASSWORD
// ==============================

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        function () {

            const savedPassword =
                localStorage.getItem(
                    "registeredPassword"
                );


            const currentPassword =
                prompt(
                    "Enter your current password:"
                );


            if (
                currentPassword === null
            ) {
                return;
            }


            if (
                currentPassword !==
                savedPassword
            ) {

                showMessage(
                    "Current password is incorrect.",
                    "error"
                );

                return;
            }


            const newPassword =
                prompt(
                    "Enter your new password:"
                );


            if (
                newPassword === null
            ) {
                return;
            }


            if (
                newPassword.length < 6
            ) {

                showMessage(
                    "New password must be at least 6 characters.",
                    "error"
                );

                return;
            }


            const confirmPassword =
                prompt(
                    "Confirm your new password:"
                );


            if (
                confirmPassword === null
            ) {
                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            localStorage.setItem(
                "registeredPassword",
                newPassword
            );


            showMessage(
                "Password changed successfully.",
                "success"
            );
        }
    );
}


// ==============================
// FORGOT PASSWORD
// ==============================

if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        function () {

            const email =
                localStorage.getItem(
                    "registeredEmail"
                );


            if (!email) {

                showMessage(
                    "No registered email was found.",
                    "error"
                );

                return;
            }


            const otp =
                generateOtp();


            localStorage.setItem(
                "forgotPasswordOtp",
                otp
            );

            localStorage.setItem(
                "forgotPasswordOtpCreatedAt",
                Date.now()
            );


            console.log(
                "DEMO FORGOT PASSWORD OTP for " +
                email +
                ": " +
                otp
            );


            const enteredOtp =
                prompt(
                    "A demo recovery OTP has been generated.\n\nCheck the browser Console for the OTP.\n\nEnter OTP:",
                    ""
                );


            if (
                enteredOtp === null
            ) {
                return;
            }


            const savedOtp =
                localStorage.getItem(
                    "forgotPasswordOtp"
                );

            const createdAt =
                Number(
                    localStorage.getItem(
                        "forgotPasswordOtpCreatedAt"
                    )
                );


            if (
                !savedOtp ||
                Date.now() -
                createdAt >
                5 * 60 * 1000
            ) {

                showMessage(
                    "OTP expired. Please try again.",
                    "error"
                );

                return;
            }


            if (
                enteredOtp.trim() !==
                savedOtp
            ) {

                showMessage(
                    "Invalid OTP.",
                    "error"
                );

                return;
            }


            const newPassword =
                prompt(
                    "Enter your new password:"
                );


            if (
                newPassword === null
            ) {
                return;
            }


            if (
                newPassword.length < 6
            ) {

                showMessage(
                    "New password must be at least 6 characters.",
                    "error"
                );

                return;
            }


            const confirmPassword =
                prompt(
                    "Confirm your new password:"
                );


            if (
                confirmPassword === null
            ) {
                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            localStorage.setItem(
                "registeredPassword",
                newPassword
            );


            localStorage.removeItem(
                "forgotPasswordOtp"
            );

            localStorage.removeItem(
                "forgotPasswordOtpCreatedAt"
            );


            showMessage(
                "Password reset successfully.",
                "success"
            );
        }
    );
}


// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "accountType"
        );

        localStorage.removeItem(
            "userName"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "accountStatus"
        );

        localStorage.removeItem(
            "joinedDate"
        );


        resetPage();

        updateBalanceButtonVisibility();


        showMessage(
            "You have been logged out.",
            "success"
        );
    }
);


// ==============================
// HOME
// ==============================

homeBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";
    }
);


// ==============================
// LIVE WARNING CLEAR
// ==============================

registerName.addEventListener(
    "input",
    function () {

        if (
            this.value.trim() !== ""
        ) {
            clearWarning(this);
        }
    }
);


registerEmail.addEventListener(
    "input",
    function () {

        if (
            isValidEmail(
                this.value.trim()
            )
        ) {
            clearWarning(this);
        }
    }
);


registerPassword.addEventListener(
    "input",
    function () {

        if (
            this.value.length >= 6
        ) {
            clearWarning(this);
        }
    }
);


registerConfirmPassword.addEventListener(
    "input",
    function () {

        if (
            this.value !== "" &&
            this.value ===
            registerPassword.value
        ) {
            clearWarning(this);
        }
    }
);


loginEmail.addEventListener(
    "input",
    function () {

        if (
            this.value.trim() !== ""
        ) {
            clearWarning(this);
        }
    }
);


loginPassword.addEventListener(
    "input",
    function () {

        if (
            this.value !== ""
        ) {
            clearWarning(this);
        }
    }
);


registerRules.addEventListener(
    "change",
    function () {

        if (this.checked) {
            clearWarning(this);
        }
    }
);


guestRules.addEventListener(
    "change",
    function () {

        if (this.checked) {
            clearWarning(this);
        }
    }
);


emailOtp.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 6);

        if (
            /^\d{6}$/.test(
                this.value
            )
        ) {
            clearWarning(this);
        }
    }
);


// ==============================
// INITIAL LOAD
// ==============================

loadSavedAccount();

});