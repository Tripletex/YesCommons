import orgnr from "./services/orgnr";
import {
    generateAccountNumber,
    getBankRegistryEntryByAccountNumber,
    validateAccountNumber,
} from "./services/kontonr";
import postnummer from "./services/postal";
import { generateKid, validateKid } from "./services/kid";
import { generateFnr, validateFnr } from "./services/fnr";
import getFnrType from "./helpers/fnr/getFnrType";

function newKidNr() {
    try {
        const RANDOM_KID_NUMBER_LENGTH = 3 + Math.floor(Math.random() * 22);
        const kidNumberSpan = document.querySelector("#kidNumberBase");
        const kidNumberLengthSpan = document.querySelector("#kidNumberLength");
        const kidNumberLength = kidNumberLengthSpan.value.trim();
        const kidNumberBase = kidNumberSpan.value.trim();
        const modulo = document.querySelector("select#modulo_generate").value;
        const kidNumber =
            !kidNumberBase && !kidNumberLength
                ? generateKid({ length: RANDOM_KID_NUMBER_LENGTH, modulo })
                : !kidNumberBase && kidNumberLength
                ? generateKid({ length: kidNumberLength, modulo })
                : generateKid({
                      length: kidNumberLength,
                      baseNum: kidNumberBase,
                      modulo,
                  });
        document.querySelector(".js-kid-nummer").innerText = kidNumber;
    } catch (e) {
        document.querySelector(".js-kid-nummer").innerText = e.message;
    }
}

function newFnr() {
    const fnrSpan = document.querySelector(".js-fnr");
    const fnrType = document.querySelector("select#fnr_type").value;
    const { fnr } = generateFnr({ fnrType });
    fnrSpan.innerText = fnr;
}

function newOrgNr() {
    const orgSpan = document.querySelector(".js-orgnr");
    orgSpan.innerText = orgnr();
}

function newKontoNr() {
    const bankRegistrySelect = document.getElementById("bankregistry");
    const selectedRegistryNumber =
        bankRegistrySelect.options[bankRegistrySelect.options.selectedIndex].value;
    const { number } = generateAccountNumber(selectedRegistryNumber);
    document.querySelector(".js-kontonr").innerText = number;
}

function validateKontoNr(e) {
    e.preventDefault();
    const accountNumberInput = document.querySelector("input#accountNumber");
    const resultSpan = document.querySelector("span#accont_validation_result");
    const initialAccountNumber = "" + accountNumberInput.value;
    const accountNumber = accountNumberInput.value.replace(/\s+/g, "");
    if (accountNumber.length !== 11) {
        resultSpan.textContent = "Et gyldig norsk kontonummer har kun 11 siffer";
        accountNumberInput.value = "";
        return;
    }
    const isValidAccountNumber = validateAccountNumber(accountNumber);
    const registryEntry = isValidAccountNumber
        ? getBankRegistryEntryByAccountNumber(accountNumber)
        : null;
    resultSpan.textContent = `${initialAccountNumber} er et ${
        isValidAccountNumber ? "gyldig" : "ugyldig"
    } kontonummer. ${
        registryEntry ? `kontonummeret tilhører ${registryEntry.bank}` : ""
    }`;
    accountNumberInput.value = "";
}

function validateKidNr(e) {
    e.preventDefault();
    try {
        const kidNumberInput = document.querySelector("input#kidNumberValidation");
        const resultSpan = document.querySelector("span#kidr_validation_result");
        const initialKidNumber = "" + kidNumberInput.value;
        const kidNumber = kidNumberInput.value.replace(/\s+/g, "");
        const modulo = document.querySelector("select#modulo_validate").value;
        const isValidKidNr = validateKid(kidNumber, modulo);
        resultSpan.textContent = `${initialKidNumber} er et ${
            isValidKidNr ? "gyldig" : "ugyldig"
        } kidnummer.`;
    } catch (error) {
        resultSpan.textContent = error.message;
    }
}

function validateFnrForm(e) {
    e.preventDefault();
    const fNrInput = document.querySelector("input#fnr_validation");
    const resultSpan = document.querySelector("span#fnr_validation_result");
    const initialFnr = "" + fNrInput.value;
    const fnrToCheck = initialFnr.replace(/\s+/g, "");
    const fnrType = getFnrType(fnrToCheck);
    const {
        success: isValidFnr,
        fnr,
        typeString,
        ...rest
    } = validateFnr(fnrToCheck, fnrType);
    if (!isValidFnr) {
        resultSpan.textContent = `${fnrToCheck} er ugyldig.`;
        fNrInput.value = "";
        return;
    }
    fNrInput.value = "";
    resultSpan.textContent = `${fnrToCheck} er et gyldig ${typeString}.`;
    if (rest.gender) {
        // This property is available if it is not a FH-number
        resultSpan.textContent += ` Dette ${typeString}et tilhører en ${
            rest.gender === "male" ? "mann" : "kvinne"
        } som er født den ${rest.date} `;
    }
}

function queryPostal(e) {
    const value = e.target.value;
    if (!value || value.length !== 4) {
        document.querySelector('[name="kommune"]').value = "";
        return;
    }
    const postalCode = parseInt(value);
    const municipality = postnummer(postalCode);
    document.querySelector('[name="kommune"]').value = municipality || "";
}

newOrgNr();
newFnr();

document.querySelector(".js-gen-orgnr").addEventListener("click", newOrgNr);
document.querySelector(".js-gen-fnr").addEventListener("click", newFnr);
document.querySelector(".js-gen-kid").addEventListener("click", newKidNr);
document.querySelector(".js-gen-kontonr").addEventListener("click", newKontoNr);
document.querySelector(".js-val-kontonr").addEventListener("click", validateKontoNr);
document.querySelector(".js-val-kidnr").addEventListener("click", validateKidNr);
document.querySelector(".js-val-fnr").addEventListener("click", validateFnrForm);
document.querySelector('[name="postnummer"]').addEventListener("input", queryPostal);
