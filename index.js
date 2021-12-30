/*jslint
    fudge
*/

import {
    identity,
    pipeN
} from "@jlrwi/combinators";
import {
    array_map
} from "@jlrwi/esfunctions";
import {
    record_requestor,
    unary_requestor
} from "@jlrwi/requestors";
import parseq from "@jlrwi/curried-parseq";
import requestor_type from "@jlrwi/requestor-type";

const req_type = requestor_type();

const k_sequence = function (log_type) {
    return function (options) {

// Reformat initial input to be a pair
        const map_initial_value_to_pair = function (initial_value) {
            return {
                fst: log_type.empty(),
                snd: initial_value
            };
        };

// Take result in form {fst, {fst, snd}} and concat fst's to return {fst, snd}
        const map_result_to_pair = function ({fst, snd}) {
            return {
                fst: log_type.concat(fst)(snd.fst),
                snd: snd.snd
            };
        };

// Take a Klesli requestor and put into a pair with log passthrough
        const map_to_record = function (requestor) {
            return req_type.map(
                map_result_to_pair
            )(
                record_requestor()({
                    fst: unary_requestor(identity),
                    snd: requestor
                })
            );
        };

// Takes array of Kleisli-type requestors
        return pipeN(
// Map them to be record requestors
            array_map(map_to_record),
// Create a sequence requestor using supplied options
            parseq.sequence(options),
// Reformat the input value to be a pair with an empty log value
            req_type.contramap(map_initial_value_to_pair)
        );
    };
};

export {
    k_sequence
};
