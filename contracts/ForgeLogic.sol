// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ForgeToken.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ForgeLogic is Initializable, OwnableUpgradeable {
    ForgeToken public forgeToken;

    function initialize(address _forgeToken) public initializer {
        __Ownable_init(msg.sender);
        forgeToken = ForgeToken(_forgeToken);
    }

    function forgeTheToken(uint256 id) external {
        require(id >= 3 && id <= 6, "Invalid token ID");

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
