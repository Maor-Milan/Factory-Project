
async function chkLogin() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;
    let currDate = new Date().toDateString();


    let srvResp = await fetch("https://localhost:44372/api/login")
    let srvData = await srvResp.json();


    //login phase
    let key;
    let isUser;
    srvData.forEach(chk => {
        if (chk.UserName === user && chk.Password === pass) {
            isUser = chk;
            sessionStorage.setItem("Login", "" + chk.FullName)
            key = true;
        }
    });

    if (key) {
        //actions per day restrictions
        let lastActionDay;
        srvData.forEach(usr => {
            console.log(usr.DateOfAction);
            if (usr.DateOfAction < currDate) lastActionDay = true;
        });

        if (!lastActionDay) {
            let putObj =
            {
                FullName: isUser.FullName,
                UserName: isUser.UserName,
                Password: isUser.Password,
                DateOfAction: currDate,
                NumOfActionsTaken: 0
            }

            let fetchParams =
            {
                method: "PUT",
                body: JSON.stringify(putObj),
                headers: { "Content-Type": "application/json" }
            }


            let logResp = await fetch("https://localhost:44372/api/login/" + isUser.ID, fetchParams)
            let logData = await srvResp.json();




            window.location.href = "homePage.html";

        } else {
            if (isUser.NumOfActionsTaken >= 3) alert('Maximum Actions:Try The Next Day 🚩');
            else window.location.href = "homePage.html";


        }


    } else {
        alert("Invalid Detailes")
    }



}


function homePageRouter(pageID) {
    switch (pageID) {
        case "emp":
            window.location.href = "employeesPage.html";
            break;
        case "depr":
            window.location.href = "departmentPage.html";
            break;
        case "sfts":
            window.location.href = "shiftPage.html";
            break;


    }
}

async function showDepartments() {
    showName();

    let res = await reachedActions().then();
    if (res === false) {

        sessionStorage.clear();
        window.location.href = "loginPage.html"
        alert("You Reached Maximum Action Per Day")

    };
    let srvResp = await fetch("https://localhost:44372/api/Department")
    let srvData = await srvResp.json();

    let idHeader = document.createElement("th");
    let departmentNameHeader = document.createElement("th");
    departmentNameHeader.innerText = "Department Name";

    let managerHeader = document.createElement("th");
    managerHeader.innerText = "Manager";

    let btnHeader = document.createElement("th");
    btnHeader.innerText = "Actions";

    let trHeader = document.createElement("tr");

    trHeader.appendChild(departmentNameHeader);
    trHeader.appendChild(managerHeader);
    trHeader.appendChild(btnHeader);

    let tableHeaderObj = document.getElementById("tbl");
    tableHeaderObj.appendChild(trHeader);


    srvData.forEach(depr => {


        let tdFullName = document.createElement("td");
        tdFullName.innerText = depr.DepartmentName;

        let tdManager = document.createElement("td");
        tdManager.innerText = depr.Manager;


        let btnTd = document.createElement("td");

        let btnEd = document.createElement("input");
        btnEd.type = "button";
        btnEd.value = "Edit";
        btnEd.classList.add("btn");
        btnEd.classList.add("btn-warning")

        btnEd.onclick = () => { editDepartment(depr.ID) };
        btnTd.appendChild(btnEd);

        let btnDel = document.createElement("input");
        btnDel.type = "button";
        btnDel.value = "Delete";
        btnDel.style.margin = "10px";
        btnDel.classList.add("btn");
        btnDel.classList.add("btn-danger")


        fillObjectMap(depr.DepartmentName).then(x => {
            if (x !== true) {
                btnTd.appendChild(btnDel);
                //console.log('Append Happend')

            }
            else console.log('')
        })

        btnDel.onclick = () => { deleteDepartmentRouter(depr.ID) };


        tdManager.innerText = depr.Manager;

        let trObj = document.createElement("tr");


        trObj.appendChild(tdFullName);
        trObj.appendChild(tdManager);
        trObj.appendChild(btnTd);


        let tableObj = document.getElementById("tbl");

        tableObj.appendChild(trObj);


    });

}


async function fillObjectMap(depName) {
    let deps = [];

    let srvDep = await fetch("https://localhost:44372/api/Department")
    let depData = await srvDep.json();


    let srvEmp = await fetch("https://localhost:44372/api/employee")
    let empData = await srvEmp.json();

    let depObj = {};
    for (let i = 0; i < depData.length; i++) {
        let dep = depData[i].DepartmentName;
        if (!deps[dep]) deps.push(dep)

    }


    deps.forEach(arr => {
        depObj[arr] = 0

    })


    for (let i = 0; i < empData.length; i++) {
        let depr = (empData[i].DepartmentID);
        depObj[getDepartmentName(depr)]++;
    }

    if (depObj[depName] !== 0) return true;
    else return false;
}

async function editDepartments() {

    let depName = document.getElementById("derpName").value;
    let mangrID = document.getElementById("mngrName").value;

    let editObj =
    {
        DepartmentName: depName,
        Manager: mangrID
    }

    const urlParams = new URLSearchParams(window.location.search);
    departmentID = urlParams.get("departmentid");



    let fetchParams =
    {
        method: 'PUT',
        body: JSON.stringify(editObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/Department/" + departmentID, fetchParams)
    let srvData = await srvResp.json();
    actionUpdater();
    alert(srvData);
    window.location.href = "departmentPage.html";

}

function editDepartment(departmentID) {
    window.location.href = "editDepartment.html?departmentid=" + departmentID;

}

function deleteDepartmentRouter(departmentID) {
    window.location.href = "deleteDepartment.html?departmentid=" + departmentID;
}

async function deleteDepartment() {
    actionUpdater();
    const urlParams = new URLSearchParams(window.location.search);
    departmentID = urlParams.get("departmentid");

    let srvDep = await fetch("https://localhost:44372/api/Department")
    let depData = await srvDep.json();

    let objDeleteName;
    let objDeleteID;
    let id = (parseInt(departmentID));


    for (let i = 0; i < depData.length; i++) {

        if (depData[i].ID === id) {
            objDeleteName = depData[i].DepartmentName;
            objDeleteID = depData[i].ID;
        }

    }

    alert("You are now deleting: " + objDeleteName + " department");

    let fetchParams =
    {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    }

    let resp = await fetch("https://localhost:44372/api/Department/" + objDeleteID, fetchParams);
    let data = await resp.json()


    window.location.href = "departmentPage.html";


}

async function showEmployees() {

    showName();
    let res = await reachedActions().then();
    if (res === false) {

        sessionStorage.clear();
        window.location.href = "loginPage.html"
        alert("You Reached Maximum Action Per Day")
    };





    let srvResp = await fetch("https://localhost:44372/api/employee")
    let srvData = await srvResp.json();

    let depResp = await fetch("https://localhost:44372/api/Department")
    let depData = await depResp.json();

    let empShiftpResp = await fetch("https://localhost:44372/api/empshift")
    let empShiftData = await empShiftpResp.json();


    let shiftResp = await fetch("https://localhost:44372/api/shift")
    let shiftData = await shiftResp.json();




    //only arrays that are not zero:
    let atShift = [];
    empShiftData.forEach(el => {
        if (el.ShiftID.length !== 0) atShift.push(el);

    });



    let idHeader = document.createElement("th");
    let employeeNameHeader = document.createElement("th");
    employeeNameHeader.innerText = "Employee Name";

    let startYearHeader = document.createElement("th");
    startYearHeader.innerText = "Starting Year";

    let departmentHeader = document.createElement("th");
    departmentHeader.innerText = "Department";

    let shiftsHeader = document.createElement("th");
    shiftsHeader.innerText = "Shifts";

    let shiftsStartTime = document.createElement("th");
    shiftsStartTime.innerText = "Shifts Start";

    let shiftsStartEnd = document.createElement("th");
    shiftsStartEnd.innerText = "Shifts End";

    let btnHeader = document.createElement("th");
    btnHeader.innerText = "Actions";

    let trHeader = document.createElement("tr");
    trHeader.appendChild(idHeader);
    trHeader.appendChild(employeeNameHeader);
    trHeader.appendChild(startYearHeader);
    trHeader.appendChild(departmentHeader);
    trHeader.appendChild(shiftsHeader);
    trHeader.appendChild(shiftsStartTime);
    trHeader.appendChild(shiftsStartEnd);
    trHeader.appendChild(btnHeader);



    let tableHeaderObj = document.getElementById("tbl");
    tableHeaderObj.appendChild(trHeader);

    srvData.forEach(emp => {
        let tdID = document.createElement("td");
        tdID.innerText = emp.ID;

        let tdFullName = document.createElement("td");
        tdFullName.innerText = emp.FullName;

        let tdYear = document.createElement("td");
        tdYear.innerText = emp.StartingYear;

        let tdDepartment = document.createElement("td");
        tdDepartment.innerText = getDepartmentName(emp.DepartmentID);


        let tdShifts = document.createElement("td");
        let selectShifts = document.createElement("select");
        let optionShifts = document.createElement("option");

        let tdShiftStart = document.createElement("td");
        let tdShiftEnd = document.createElement("td");




        getEmpShifts(emp.ID).then(x => {

            for (let i = 0; i < x.length; i++) {
                let optionShifts = document.createElement("option");
                optionShifts.innerText += x[i].Date;
                tdShiftStart.innerText += x[i].ShiftStart;
                tdShiftEnd.innerText += x[i].ShiftEnd;
                selectShifts.classList.add("custom-select");
                selectShifts.appendChild(optionShifts);
                tdShifts.appendChild(selectShifts)


            }

        }

        );





        let btnTd = document.createElement("td");

        let btnEd = document.createElement("input");
        btnEd.classList.add("btn")
        btnEd.classList.add("btn-warning")
        btnEd.style.margin = "5px";
        btnEd.type = "button";
        btnEd.value = "Edit";
        btnEd.onclick = () => { editEmployeeRouter(emp.ID) };
        btnTd.appendChild(btnEd);

        let btnDel = document.createElement("input");
        btnDel.classList.add("btn")
        btnDel.classList.add("btn-danger");
        btnDel.style.margin = "5px";
        btnDel.type = "button";
        btnDel.value = "Delete";
        btnTd.appendChild(btnDel);
        btnDel.onclick = () => { deleteEmployeeRouter(emp.ID) };


        let btnAdd = document.createElement("input");
        btnAdd.classList.add("btn")
        btnAdd.classList.add("btn-primary");
        btnAdd.style.margin = "5px";
        btnAdd.type = "button";
        btnAdd.value = "Add Shift";
        btnTd.appendChild(btnAdd);
        btnAdd.onclick = () => { addShiftToEmployeeRouter(emp.ID) };



        let trObj = document.createElement("tr");

        trObj.appendChild(tdID);
        trObj.appendChild(tdFullName);
        trObj.appendChild(tdYear);
        trObj.appendChild(tdDepartment);
        trObj.appendChild(tdShifts);
        trObj.appendChild(tdShiftStart);
        trObj.appendChild(tdShiftEnd);
        trObj.appendChild(btnTd);


        let tableObj = document.getElementById("tbl");

        tableObj.appendChild(trObj);





    });


}



function addDepartmentRouter() {
    window.location.href = "addDepartment.html"
}

async function addDepartment() {
    let depName = document.getElementById("depName").value;
    let depMngr = document.getElementById("depMngr").value;

    console.log(depName + " " + depMngr);

    let addObj =
    {
        DepartmentName: depName,
        Manager: depMngr
    }

    let fetchParams =
    {
        method: "POST",
        body: JSON.stringify(addObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/Department", fetchParams)
    let srvData = await srvResp.json();


    actionUpdater();
    alert(srvData);
    window.location.href = "departmentPage.html";


}


function getDepartmentName(id) {
    switch (id) {
        case 1:
            return "HR";
        case 2:
            return "Security"
        case 3:
            return "Finance";
        case 4:
            return "IT"
        case 5:
            return "Managment";

        default: "Invalid Department Id( only 1 to 5)";
            break;
    }



}

function editEmployeeRouter(empID) {
    window.location.href = "editEmployee.html?empID=" + empID;
}

async function editEmployee() {

    const urlParams = new URLSearchParams(window.location.search);
    empID = urlParams.get("empID");


    let empResp = await fetch("https://localhost:44372/api/employee/")
    let empData = await empResp.json();


    //let intID = parseInt(empID);



    let empName = document.getElementById("empName").value;
    let year = document.getElementById("year").value;
    let depName = document.getElementById("depID").value;


    let editObj =
    {
        FullName: empName,
        StartingYear: year,
        DepartmentID: parseInt(depName)
    }






    let fetchParams =
    {
        method: 'PUT',
        body: JSON.stringify(editObj),
        headers: { "Content-Type": "application/json" }
    }




    let srvResp = await fetch("https://localhost:44372/api/employee/" + empID, fetchParams)
    let srvData = await srvResp.json();

    actionUpdater();
    alert(srvData);
    window.location.href = "employeesPage.html";
}

function deleteEmployeeRouter(empID) {
    window.location.href = "deleteEmployee.html?empID=" + empID;
}
async function deleteEmployee() {
    actionUpdater();
    const urlParams = new URLSearchParams(window.location.search);
    empID = urlParams.get("empID");
    let intEmpID = parseInt(empID);


    let srvEmp = await fetch("https://localhost:44372/api/employee")
    let empData = await srvEmp.json();

    let srvEmpShift = await fetch("https://localhost:44372/api/EmpShiftTable/")
    let empShiftData = await srvEmpShift.json();
    console.log(empShiftData);

    let logResp = await fetch("https://localhost:44372/api/login")
    let logData = await logResp.json();

    let shiftToDelete;
    empShiftData.forEach(s => {
        if (s.EmpID === intEmpID) shiftToDelete = s.ID;
    })




    let chosenEmpID;
    for (let i = 0; i < empData.length; i++) {

        if (empData[i].ID === intEmpID)
            chosenEmpID = empData[i].ID;
    }

    console.log(intEmpID);
    //delete user login


    let perToDelete;
    empData.forEach(el => {
        if (el.ID === chosenEmpID) perToDelete = el;;
    });

    console.log(perToDelete);

    let idToDelete;
    logData.forEach(el => {

        if (el.FullName === perToDelete.FullName) idToDelete = el.ID;;
    });

    console.log(idToDelete);


    let fetchParamsLog =
    {
        method: 'DELETE',

        headers: { "Content-Type": "application/json" }
    }

    let srvResp = await fetch("https://localhost:44372/api/login/" + idToDelete, fetchParamsLog)
    let srvData = await srvResp.json();






    let fetchParams =
    {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    }



    let resp = await fetch("https://localhost:44372/api/employee/" + chosenEmpID, fetchParams);
    let data = await resp.json()

    let respEmpShift = await fetch("https://localhost:44372/api/EmpShiftTable/" + shiftToDelete, fetchParams);
    let dataEmpShift = await respEmpShift.json()


    window.location.href = "employeeSPage.html";


}

function addEmployeeRouter() {
    window.location.href = "addEmployee.html"

}

async function addEmployee() {

    let empName = document.getElementById("empName").value;
    let startYear = document.getElementById("startYear").value;
    let depID = document.getElementById("depID").value;

    let currDate = new Date().toDateString();

    let signUserObj =
    {
        FullName: empName,
        UserName: empName + "10",
        Password: "12345",
        DateOfAction: currDate,
        NumOfActionsTaken: 0
    }


    let fetchParamsSign =
    {
        method: "POST",
        body: JSON.stringify(signUserObj),
        headers: { "Content-Type": "application/json" }
    }

    let sgnResp = await fetch("https://localhost:44372/api/login", fetchParamsSign)
    let sgnData = await sgnResp.json();

    let addObj =
    {
        FullName: empName,
        StartingYear: startYear,
        DepartmentID: depID,

    }



    let fetchParams =
    {
        method: "POST",
        body: JSON.stringify(addObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/employee", fetchParams)
    let srvData = await srvResp.json();

    actionUpdater();
    alert(srvData);
    window.location.href = "employeesPage.html";


}


async function showShifts() {

    showName();

    let res = await reachedActions().then();
    if (res === false) {

        sessionStorage.clear();
        window.location.href = "loginPage.html"
        alert("You Reached Maximum Action Per Day")
    };
    let srvShfts = await fetch("https://localhost:44372/api/shift")
    let shftsrvData = await srvShfts.json();


    let srvEmps = await fetch("https://localhost:44372/api/employee")
    let empsData = await srvEmps.json();



    let idHeader = document.createElement("th");


    let shftDateHeader = document.createElement("th");
    shftDateHeader.innerText = "Shift Date";

    let shftStartHeader = document.createElement("th");
    shftStartHeader.innerText = "Shift Start";

    let shftFinishHeader = document.createElement("th");
    shftFinishHeader.innerText = "Shift Finish";

    let btnHeader = document.createElement("th");
    btnHeader.innerText = "Employees";

    let trHeader = document.createElement("tr");
    trHeader.appendChild(idHeader);
    trHeader.appendChild(shftDateHeader);
    trHeader.appendChild(shftStartHeader);
    trHeader.appendChild(shftFinishHeader);
    trHeader.appendChild(btnHeader);



    let tableHeaderObj = document.getElementById("tbl");
    tableHeaderObj.appendChild(trHeader);

    shftsrvData.forEach(sft => {
        let tdID = document.createElement("td");
        tdID.innerText = sft.ID;

        let tdDate = document.createElement("td");
        tdDate.innerText = sft.Date;

        let tdSftStart = document.createElement("td");
        tdSftStart.innerText = sft.ShiftStart;

        let tdSftEnd = document.createElement("td");
        tdSftEnd.innerText = sft.ShiftEnd;

        let tdShiftEmps = document.createElement("td");
        getEmpByShiftID(sft.ID).then(
            x => {
                if (x.length === 0) {

                    tdShiftEmps.innerText = "No Employees Yet"
                } else {
                    let h4 = document.createElement("h4");
                    h4.innerText = "Employees:";
                    tdShiftEmps.appendChild(h4);
                    for (let i = 0; i < x.length; i++) {
                        let listHeader = document.createElement("ul");
                        let list = document.createElement("li");

                        let empLink = document.createElement("a");


                        let name = x[i];
                        let found = empsData.find(element => element.FullName === name);

                        empLink.text = x[i];
                        empLink.href = "editEmployee.html?empID=" + found.ID;
                        list.appendChild(empLink);

                        listHeader.appendChild(list);
                        tdShiftEmps.appendChild(listHeader);

                    }

                }
            }
        )

        let trObj = document.createElement("tr");

        trObj.appendChild(tdID);
        trObj.appendChild(tdDate);
        trObj.appendChild(tdSftStart);
        trObj.appendChild(tdSftEnd);
        trObj.appendChild(tdShiftEmps);




        let tableObj = document.getElementById("tbl");

        tableObj.appendChild(trObj);





    });


}




async function getEmpByShiftID(id) {
    let srvEmps = await fetch("https://localhost:44372/api/empshift");
    let empsData = await srvEmps.json();

    let Emps = await fetch("https://localhost:44372/api/employee");
    let emps = await Emps.json();



    let chosenEmp = [];
    for (let i = 0; i < empsData.length; i++) {
        if (empsData[i].ShiftID.includes(id)) chosenEmp.push(empsData[i].EmployeeID);

    }

    let empArr = [];
    for (let i = 0; i < chosenEmp.length; i++) {
        let currEmp = chosenEmp[i];
        for (let j = 0; j < emps.length; j++) {
            if (emps[j].ID === currEmp) empArr.push(emps[j].FullName);
        }


    }
    return empArr;

}





function addShiftRouter() {
    window.location.href = "addShift.html";
}

async function addShift() {
    let date = document.getElementById("date").value;
    let shiftStart = document.getElementById("shiftStart").value;
    let shiftEnd = document.getElementById("shiftEnd").value;


    let addObj =
    {
        Date: date,
        ShiftStart: shiftStart,
        ShiftEnd: shiftEnd,
    }





    let fetchParams =
    {
        method: "POST",
        body: JSON.stringify(addObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/Shift", fetchParams)
    let srvData = await srvResp.json();

    actionUpdater();
    alert(srvData);
    window.location.href = "ShiftPage.html";


}

function addShiftToEmployeeRouter(empID) {
    window.location.href = "addShiftToEmployee.html?empID=" + empID;

}

async function addShiftToEmployee() {

    showName();
    const urlParams = new URLSearchParams(window.location.search);
    let empID = parseInt(urlParams.get("empID"));

    let srvResp = await fetch("https://localhost:44372/api/shift/")
    let srvData = await srvResp.json();

    let srvEmps = await fetch("https://localhost:44372/api/employee/")
    let empsData = await srvEmps.json();



    let td = document.createElement("td");

    let selectShifts = document.createElement("ul");
    let tbl = document.getElementById("tbl");
    let tr = document.createElement("tr");


    for (let i = 0; i < srvData.length; i++) {
        let optionShifts = document.createElement("li");



        optionShifts.innerText = srvData[i].Date;
        optionShifts.setAttribute('id', "shift");

        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Add To User";

        optionShifts.appendChild(btn);

        optionShifts.style.padding = "5px"
        btn.style.margin = "5px"
        btn.classList.add("btn")
        btn.classList.add("btn-primary");
        btn.onclick = () => { addShiftBtn(srvData[i].ID, empID) }



        selectShifts.appendChild(optionShifts);
        td.appendChild(selectShifts);
        tr.appendChild(td);


        tbl.appendChild(tr)


    }









    actionUpdater();

}

async function addShiftBtn(shiftID, empID) {
    console.log(shiftID);
    console.log(empID);

    let srvEmps = await fetch("https://localhost:44372/api/employee/");
    let empsData = await srvEmps.json();

    let srvShifts = await fetch("https://localhost:44372/api/shift/");
    let shiftsData = await srvShifts.json();

    let employee;
    empsData.forEach(emp => {
        if (emp.ID === empID) employee = emp;
    });


    let shift;
    shiftsData.forEach(sft => {
        if (sft.ID === shiftID) shift = sft;
    });







    let putObj =
    {
        EmpID: empID,
        ShiftID: shiftID

    }



    let fetchParams =
    {
        method: 'POST',
        body: JSON.stringify(putObj),
        headers: { "Content-Type": "application/json" }
    }



    let srvResp = await fetch("https://localhost:44372/api/EmpShift/", fetchParams)
    let srvData = await srvResp.json();

    alert(srvData);
    window.location.href = "employeesPage.html";




}

async function getEmpShifts(empID) {




    let empShiftpResp = await fetch("https://localhost:44372/api/empshift")
    let empShiftData = await empShiftpResp.json();


    let shiftResp = await fetch("https://localhost:44372/api/shift")
    let shiftData = await shiftResp.json();



    let shiftsObj = [];
    let shiftsIndex;
    empShiftData.forEach(el => {
        if (el.EmployeeID === empID) shiftsIndex = el.ShiftID;

    });


    for (let i = 0; i < shiftsIndex.length; i++) {
        let currIndex = shiftsIndex[i];
        for (let j = 0; j < shiftData.length; j++) {
            if (shiftData[j].ID === currIndex) shiftsObj.push(shiftData[j]);

        }

    }

    if (shiftsObj.length === 0) return false;
    else return shiftsObj;

}

function searchPageRouter() {
    let searchWord = document.getElementById("srchInput").value;

    window.location.href = "searchPage.html?searchWord=" + searchWord;
}

async function searchPage() {
    showName();
    const urlParams = new URLSearchParams(window.location.search);
    let searchWord = urlParams.get("searchWord");
    searchWord = searchWord.charAt(0).toUpperCase() + searchWord.slice(1);
    // console.log(searchWord);


    let empResp = await fetch("https://localhost:44372/api/employee")
    let empData = await empResp.json();

    //  console.log(empData);

    let per;
    empData.forEach(x => {
        if (x.FullName == searchWord || x.FullName.includes(searchWord)) per = x;
    }
    )


    if (per == undefined || searchWord == "") {
        let h1 = document.getElementById("h1");
        h1.innerText = " No Such Employee Exist";
    } else {

        let perArr = [];
        perArr.push(per);
        let idHeader = document.createElement("th");
        let employeeNameHeader = document.createElement("th");
        employeeNameHeader.innerText = "Employee Name";

        let startYearHeader = document.createElement("th");
        startYearHeader.innerText = "Starting Year";

        let departmentHeader = document.createElement("th");
        departmentHeader.innerText = "Department";





        let trHeader = document.createElement("tr");
        trHeader.appendChild(idHeader);
        trHeader.appendChild(employeeNameHeader);
        trHeader.appendChild(startYearHeader);
        trHeader.appendChild(departmentHeader);




        let tableHeaderObj = document.getElementById("tbl");
        tableHeaderObj.appendChild(trHeader);

        perArr.forEach(p => {
            //console.log(p);
            let tdID = document.createElement("td");
            tdID.innerText = p.ID;

            let tdFullName = document.createElement("td");
            tdFullName.innerText = p.FullName;

            let tdYear = document.createElement("td");
            tdYear.innerText = p.StartingYear;

            let tdDepartment = document.createElement("td");
            tdDepartment.innerText = getDepartmentName(p.DepartmentID);

            let trObj = document.createElement("tr");

            trObj.appendChild(tdID);
            trObj.appendChild(tdFullName);
            trObj.appendChild(tdYear);
            trObj.appendChild(tdDepartment);


            let tableObj = document.getElementById("tbl");

            tableObj.appendChild(trObj);

        });
    }

}
function empPageRouter() {
    window.location.href = "employeesPage.html"
}

function searchPageRouterDep() {
    let searchWord = document.getElementById("srchInputDep").value;

    window.location.href = "searchPageDep.html?searchWord=" + searchWord;
}

async function searchPageDep() {
    showName();
    const urlParams = new URLSearchParams(window.location.search);
    let searchWord = urlParams.get("searchWord");

    let depResp = await fetch("https://localhost:44372/api/department")
    let depData = await depResp.json();

    let upper = searchWord.toUpperCase();
    let depName;
    let depIndex;
    switch (upper) {
        case "HR":
            depName = "HR";
            depIndex = 1;
            break;
        case "SECURITY":
            depName = "Security";
            depIndex = 2;
            break;
        case "FINANCE":
            depName = "Finance";
            depIndex = 3;
            break;
        case "IT":
            depName = "IT";
            depIndex = 4;
            break;
        case "MANAGMENT":
            depName = "Managment";
            depIndex = 5;
            break;
        default: depName = "No Such Department";
            break;

    }


    if (depName === "No Such Department") {
        let h1 = document.getElementById("h1");
        h1.innerText = " No Such Department Exist";
    } else {


        let dep;

        depData.forEach(x => {
            if (x.DepartmentName == depName || x.DepartmentName.includes(depName)) dep = x.DepartmentName;
        }
        )

        let empResp = await fetch("https://localhost:44372/api/employee")
        let empData = await empResp.json();


        let depArr = [];
        empData.forEach(dep => {
            // console.log(dep);
            // console.log(depIndex);
            if (dep.DepartmentID === depIndex) depArr.push(dep);

        });


        let departmentNameHeader = document.createElement("th");
        departmentNameHeader.innerText = depName + " Employees";


        let trHeader = document.createElement("tr");

        trHeader.appendChild(departmentNameHeader);


        let tableHeaderObj = document.getElementById("tbl");
        tableHeaderObj.appendChild(trHeader);

        depArr.forEach(d => {

            let tdFullName = document.createElement("td");
            tdFullName.innerText = d.FullName;

            let trObj = document.createElement("tr");
            trObj.appendChild(tdFullName);

            let tableObj = document.getElementById("tbl");

            tableObj.appendChild(trObj);

        });
    }

}

function showName() {
    let sessionName = sessionStorage.getItem("Login");
    let span = document.getElementById("name");

    if (sessionName === null) span.innerText = "!Not Logged-in"
    else {
        span.classList.add("badge")
        span.classList.add("badge-primary")

        span.innerText = sessionName;
    }

}


async function actionUpdater() {
    showName();
    logDateOfAction()
    let logedUser = sessionStorage.getItem("Login");

    let usrResp = await fetch("https://localhost:44372/api/login")
    let usrData = await usrResp.json();

    let user;
    let userIdToPut;
    usrData.forEach(usr => {
        if (usr.FullName === logedUser) {
            user = usr;
            userIdToPut = usr.ID;
        }
    });


    console.log(user);
    console.log(userIdToPut);

    let putObj =
    {
        FullName: user.FullName,
        UserName: user.UserName,
        Password: user.Password,
        DateOfAction: user.DateOfAction,
        NumOfActionsTaken: user.NumOfActionsTaken + 1
    }



    let fetchParams =
    {
        method: "PUT",
        body: JSON.stringify(putObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/login/" + userIdToPut, fetchParams)
    let srvData = await srvResp.json();






}

async function reachedActions() {
    showName();
    let logedUser = sessionStorage.getItem("Login");
    console.log(logedUser);

    let usrResp = await fetch("https://localhost:44372/api/login")
    let usrData = await usrResp.json();


    let userActions;
    usrData.forEach(usr => {
        // console.log(usr);
        if (usr.FullName === logedUser) userActions = usr.NumOfActionsTaken;
    });

    // console.log(userActions);

    if (userActions < 3) return true;
    else return false;



}


async function logDateOfAction() {
    showName();
    let usrResp = await fetch("https://localhost:44372/api/login")
    let usrData = await usrResp.json();

    let currDate = new Date().toDateString();


    let currUser = sessionStorage.getItem("Login");
    let userID;
    let userToUpdate;
    usrData.forEach(usr => {
        if (usr.FullName === currUser) {
            userToUpdate = usr;
            userID = usr.ID;
        }
    });
    console.log(userToUpdate);

    let putObj =
    {
        FullName: userToUpdate.FullName,
        UserName: userToUpdate.UserName,
        Password: userToUpdate.Password,
        DateOfAction: currDate,
        NumOfActionsTaken: userToUpdate.NumOfActionsTaken
    }



    let fetchParams =
    {
        method: "PUT",
        body: JSON.stringify(putObj),
        headers: { "Content-Type": "application/json" }
    }


    let srvResp = await fetch("https://localhost:44372/api/login/" + userID, fetchParams)
    let srvData = await srvResp.json();



}

function logOut() {
    sessionStorage.clear();
    alert("Have A Nice Day");
    window.location.href = "loginPage.html";

}











