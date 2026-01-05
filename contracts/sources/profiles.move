module rizz_club::profile {
    use std::error;
    use std::string::{String};
    use std::signer;
    use std::vector;

    struct Profile has key, store, copy, drop {
        username: String,
        links: vector<Link>,

        // 1 byte for each config, each bit 0 or 1
        // 0: ads
        // 1: chat
        // 2: products
        // 3: prediction market
        // 4: lì xì
        configs: vector<u8>
    }

    struct Link has key, store, copy, drop {
        provider: String,
        link: String
    }

    /// Error code indicating no message is present.
    const E_NO_PROFILE: u64 = 0;
    const E_PROFILE_EXISTS: u64 = 1;
    const E_INVALID_LINKS: u64 = 2;

    #[view]
    public fun signature(): address {
        @rizz_club
    }

    #[view]
    public fun get_profile(addr: address): Profile acquires Profile {
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        *borrow_global<Profile>(addr)
    }

    public entry fun create_profile(
        account: signer,
        username: String,
        providers: vector<String>,
        link_urls: vector<String>,
        configs: vector<u8>
    ) {
        let addr = signer::address_of(&account);
        assert!(!exists<Profile>(addr), error::already_exists(E_PROFILE_EXISTS));
        assert!(vector::length(&providers) == vector::length(&link_urls), error::invalid_argument(E_INVALID_LINKS));
        
        let links = vector::empty<Link>();
        let i = 0;
        let len = vector::length(&providers);
        while (i < len) {
            vector::push_back(&mut links, Link {
                provider: providers[i],
                link: link_urls[i],
            });
            i += 1;
        };
        
        move_to(&account, Profile {
            username,
            links,
            configs,
        });
    }

    // Helper function to construct links vector from providers and link_urls
    fun construct_links(providers: vector<String>, link_urls: vector<String>): vector<Link> {
        assert!(vector::length(&providers) == vector::length(&link_urls), error::invalid_argument(E_INVALID_LINKS));
        let links = vector::empty<Link>();
        let i = 0;
        let len = vector::length(&providers);
        while (i < len) {
            vector::push_back(&mut links, Link {
                provider: providers[i],
                link: link_urls[i],
            });
            i += 1;
        };
        links
    }

    // Update just the username
    public entry fun update_username(account: signer, new_username: String) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global_mut<Profile>(addr);
        profile.username = new_username;
    }

    // Update just the links
    public entry fun update_links(
        account: signer,
        providers: vector<String>,
        link_urls: vector<String>
    ) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global_mut<Profile>(addr);
        profile.links = construct_links(providers, link_urls);
    }

    // Update just the configs
    public entry fun update_configs(account: signer, configs: vector<u8>) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global_mut<Profile>(addr);
        profile.configs = configs;
    }

    // Update both username and links
    public entry fun update_profile(
        account: signer,
        new_username: String,
        providers: vector<String>,
        link_urls: vector<String>,
        configs: vector<u8>
    ) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global_mut<Profile>(addr);
        profile.username = new_username;
        profile.links = construct_links(providers, link_urls);
        profile.configs = configs;
    }
}