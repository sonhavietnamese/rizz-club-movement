module rizz_club::helpers {
    use std::vector;

    // Helper function to check if an address exists in a vector
    public fun contains_address(vec: &vector<address>, addr: address): bool {
        let i = 0;
        let len = vector::length(vec);
        while (i < len) {
            if (vec[i] == addr) {
                return true
            };
            i += 1;
        };
        false
    }

    // Helper function to remove an address from a vector
    public fun remove_address(vec: &mut vector<address>, addr: address) {
        let i = 0;
        let len = vector::length(vec);
        while (i < len) {
            if (vec[i] == addr) {
                vector::remove(vec, i);
                return
            };
            i += 1;
        };
    }
}

