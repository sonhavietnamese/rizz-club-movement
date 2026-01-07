module rizz_club::profile {
    use std::error;
    use std::string::{Self as string, String};
    use std::signer;
    use std::vector;
    use rizz_club::helpers;

    struct Profile has key, store, copy, drop {
        username: String,
        links: vector<Link>,
        pfp: String,

        // 1 byte for each config, each bit 0 or 1
        // 0: ads
        // 1: chat
        // 2: products
        // 3: prediction market
        // 4: lì xì
        configs: vector<u8>,
        followers: vector<address>,
        following: vector<address>,

        // first index is creator, second index is follower
        types: vector<u8>,
    }

    struct Link has key, store, copy, drop {
        provider: String,
        link: String
    }

    /// Error code indicating no message is present.
    const E_NO_PROFILE: u64 = 0;
    const E_PROFILE_EXISTS: u64 = 1;
    const E_INVALID_LINKS: u64 = 2;
    const E_ALREADY_FOLLOWING: u64 = 3;
    const E_NOT_FOLLOWING: u64 = 4;
    const E_CANNOT_FOLLOW_SELF: u64 = 5;

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
        configs: vector<u8>,
        types: vector<u8>,
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
            pfp: string::utf8(b""),
            configs,
            followers: vector::empty<address>(),
            following: vector::empty<address>(),
            types,
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

    // Update just the types
    public entry fun update_types(account: signer, types: vector<u8>) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global_mut<Profile>(addr);
        profile.types = types;
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


    // Follow a user: add them to your following list and add yourself to their followers list
    public entry fun follow(account: signer, follow_addr: address) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        assert!(exists<Profile>(follow_addr), error::not_found(E_NO_PROFILE));
        assert!(addr != follow_addr, error::invalid_argument(E_CANNOT_FOLLOW_SELF));
        
        // Use immutable borrow for validation in a block scope
        {
            let follower_profile_ref = borrow_global<Profile>(addr);
            assert!(!helpers::contains_address(&follower_profile_ref.following, follow_addr), error::already_exists(E_ALREADY_FOLLOWING));
        };
        
        // Update follower profile first
        {
            let follower_profile = borrow_global_mut<Profile>(addr);
            vector::push_back(&mut follower_profile.following, follow_addr);
        };
        
        // Then update followee profile
        {
            let followee_profile = borrow_global_mut<Profile>(follow_addr);
            vector::push_back(&mut followee_profile.followers, addr);
        };
    }

    // Unfollow a user: remove them from your following list and remove yourself from their followers list
    public entry fun unfollow(account: signer, unfollow_addr: address) acquires Profile {
        let addr = signer::address_of(&account);
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        assert!(exists<Profile>(unfollow_addr), error::not_found(E_NO_PROFILE));
        
        // Use immutable borrow for validation in a block scope
        {
            let follower_profile_ref = borrow_global<Profile>(addr);
            assert!(helpers::contains_address(&follower_profile_ref.following, unfollow_addr), error::not_found(E_NOT_FOLLOWING));
        };
        
        // Update follower profile first
        {
            let follower_profile = borrow_global_mut<Profile>(addr);
            helpers::remove_address(&mut follower_profile.following, unfollow_addr);
        };
        
        // Then update followee profile
        {
            let followee_profile = borrow_global_mut<Profile>(unfollow_addr);
            helpers::remove_address(&mut followee_profile.followers, addr);
        };
    }

    // View function to get followers list
    #[view]
    public fun get_followers(addr: address): vector<address> acquires Profile {
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global<Profile>(addr);
        profile.followers
    }

    // View function to get following list
    #[view]
    public fun get_following(addr: address): vector<address> acquires Profile {
        assert!(exists<Profile>(addr), error::not_found(E_NO_PROFILE));
        let profile = borrow_global<Profile>(addr);
        profile.following
    }

    // View function to check if one address follows another
    #[view]
    public fun is_following(follower_addr: address, followee_addr: address): bool acquires Profile {
        if (!exists<Profile>(follower_addr)) {
            return false
        };
        let profile = borrow_global<Profile>(follower_addr);
        helpers::contains_address(&profile.following, followee_addr)
    }
}