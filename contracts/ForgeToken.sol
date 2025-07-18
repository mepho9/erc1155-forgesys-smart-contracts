// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IForgeLogic {
    function canForge(address user, uint256 id) external view returns (bool);
}

contract ForgeToken is Initializable, ERC1155Upgradeable, OwnableUpgradeable {
    mapping(address => uint256) public lastMintTime;
    // cooldown put to 2 sec for the tests otherwise it should be 60 sec
    uint256 public constant COOLDOWN = 2;

    address public forgeContract;

    function initialize() public initializer {
        __ERC1155_init("ipfs://bafybeibrvqbdypqosvqv3g6ktkwrq2rlzde3cgoe52v2wqmzmiuzthdogi/{id}.json");
        __Ownable_init(msg.sender);
    }

    function mint(uint256 id) public {
        require(id <= 2, "id must be between 0 and 2");
        require(block.timestamp >= lastMintTime[msg.sender] + COOLDOWN, "Cooldown: wait 1s");

        lastMintTime[msg.sender] = block.timestamp;
        _mint(msg.sender, id, 1, "");
    }

    function mintFromForge(address to, uint256 id) public {
        require(msg.sender == forgeContract, "Only forge can mint");
        require(id >= 3 && id <= 6, "Only forgeable tokens allowed");
        _mint(to, id, 1, "");
    }

    function burn(address from, uint256 id, uint256 amount) public {
        require(msg.sender == forgeContract, "Only forge can burn");
        _burn(from, id, amount);
    }

    function setForgeContract(address _forgeContract) external onlyOwner {
        require(_forgeContract != address(0), "Invalid address");
        forgeContract = _forgeContract;
    }
}

