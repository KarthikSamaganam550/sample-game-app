pragma solidity ^0.4.24;

contract StoreGameEventsLog {
    mapping(string => string) private userEvents;
    function set(string hash, string userId) public {
        userEvents[userId] = hash;

    }
    function get(string userId) public view returns (string) {
        return userEvents[userId];
    }

}