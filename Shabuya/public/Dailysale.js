document.getElementById("Submit").onclick = function(){

    var AYCESale = document.getElementById("AYCE").value;
    var BSSale = document.getElementById("AYCE").value;

    var GrossSale = AYCESale + BSSale;

    document.write(AYCESale);
}

let AYCESale = document.getElementById("Sale1");
AYCESale.innerHTML = "SHOW THE SALE NUMBER";
