// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LegacyForgeToken is ERC1155, Ownable {
    mapping(address => uint256) public lastMintTime;
    uint256 public constant COOLDOWN = 60;

    address public forgeContract;

    constructor()
        ERC1155(
            "ipfs://bafybeibrvqbdypqosvqv3g6ktkwrq2rlzde3cgoe52v2wqmzmiuzthdogi/{id}.json"
        )
        Ownable(msg.sender)
    {}

    function mint(uint256 id) public {
        require(id <= 2, "id must be between 0 and 2");
        require(
            block.timestamp >= lastMintTime[msg.sender] + COOLDOWN,
            "1 minute cooldown before minting a new token"
        );

        lastMintTime[msg.sender] = block.timestamp;
        _mint(msg.sender, id, 1, "");
    }

    function mintFromForge(address to, uint256 id) public {
        require(msg.sender == forgeContract, "Only forge contract can mint");
        require(id >= 3 && id <= 6, "Only tokens from 3 to 6 can be forged");

        _mint(to, id, 1, "");
    }

    function setForgeContract(address _forgeContract) external onlyOwner {
        require(_forgeContract != address(0), "Invalid address");
        forgeContract = _forgeContract;
    }

    function burn(address from, uint256 id, uint256 amount) public {
        require(msg.sender == forgeContract, "Only forge contract can burn");
        _burn(from, id, amount);
    }
}

contract LegacyForgeLogic is Ownable {
    LegacyForgeToken public immutable forgeToken;

    constructor(address _forgeToken) Ownable(msg.sender) {
        forgeToken = LegacyForgeToken(_forgeToken);
    }

    function forgeTheToken(uint256 id) external {
        require(id >= 3 && id <= 6, "token must be from 3 to 6");

        if (id == 3) {
            forgeToken.burn(msg.sender, 0, 1);
            forgeToken.burn(msg.sender, 1, 1);
        } else if (id == 4) {
            forgeToken.burn(msg.sender, 1, 1);
            forgeToken.burn(msg.sender, 2, 1);
        } else if (id == 5) {
            forgeToken.burn(msg.sender, 0, 1);
            forgeToken.burn(msg.sender, 2, 1);
        } else if (id == 6) {
            forgeToken.burn(msg.sender, 0, 1);
            forgeToken.burn(msg.sender, 1, 1);
            forgeToken.burn(msg.sender, 2, 1);
        }

        forgeToken.mintFromForge(msg.sender, id);
    }
}