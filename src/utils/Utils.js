// Transaction codes, see: https://github.com/hyperledger/fabric-protos-go/blob/main/peer/transaction.pb.go
export const tx_codes = {
    0:   "VALID",
    1:   "NIL_ENVELOPE",
    2:   "BAD_PAYLOAD",
    3:   "BAD_COMMON_HEADER",
    4:   "BAD_CREATOR_SIGNATURE",
    5:   "INVALID_ENDORSER_TRANSACTION",
    6:   "INVALID_CONFIG_TRANSACTION",
    7:   "UNSUPPORTED_TX_PAYLOAD",
    8:   "BAD_PROPOSAL_TXID",
    9:   "DUPLICATE_TXID",
    10:  "ENDORSEMENT_POLICY_FAILURE",
    11:  "MVCC_READ_CONFLICT",
    12:  "PHANTOM_READ_CONFLICT",
    13:  "UNKNOWN_TX_TYPE",
    14:  "TARGET_CHAIN_NOT_FOUND",
    15:  "MARSHAL_TX_ERROR",
    16:  "NIL_TXACTION",
    17:  "EXPIRED_CHAINCODE",
    18:  "CHAINCODE_VERSION_CONFLICT",
    19:  "BAD_HEADER_EXTENSION",
    20:  "BAD_CHANNEL_HEADER",
    21:  "BAD_RESPONSE_PAYLOAD",
    22:  "BAD_RWSET",
    23:  "ILLEGAL_WRITESET",
    24:  "INVALID_WRITESET",
    25:  "INVALID_CHAINCODE",
    254: "NOT_VALIDATED",
    255: "INVALID_OTHER_REASON",
}

export default {
    tx_codes
};