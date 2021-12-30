/*jslint
    fudge, node
*/

import {
    k_sequence
} from "./index.js";
import {
    unary_requestor
} from "@jlrwi/requestors";
import {
    slm,
    array_type
} from "@jlrwi/es-static-types";

const log_type = array_type(slm.str);
const initial_value = 3;

console.log("Initial value:", initial_value);

const k_add_one = function (x) {
    return {
        fst: "add one",
        snd: x + 1
    };
};

const k_square = function (x) {
    return {
        fst: "square",
        snd: x * x
    };
};

const k_invert = function (x) {
    return {
        fst: "invert",
        snd: -x
    };
};

const callback = function (value, reason) {
    console.log("Result:", value, reason);
};

// Make array of kleisli-type requestors
const k_requestors = [k_square, k_add_one, k_invert].map(unary_requestor);

// Make the kleisli-type sequence requestor
const sequence = k_sequence(log_type)()(k_requestors);

// Execute the requestor
sequence(callback)(initial_value);