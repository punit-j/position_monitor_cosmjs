# Red-Bank Position Monitor

This TypeScript script is designed to interact with a CosmWasm smart contract deployed on the Osmosis network. It tracks transactions related to certain actions (borrowing, liquidating, depositing, withdrawing, and repaying) on the specified contract address and updates position details accordingly. The script continuously monitors new blocks for transactions and updates the JSON data file with the latest position details.

## Prerequisites

- Node.js and yarn installed on your system.
- Ensure you have the required dependencies installed via yarn.
- Access to a CosmWasm smart contract deployed on the Osmosis network.
- Set up environment variables using a `.env` file with the required RPC endpoint.

## Dependencies

The script relies on the following dependencies:
- `@cosmjs/cosmwasm-stargate`: For interacting with CosmWasm smart contracts.
- `@cosmjs/crypto`: For cryptographic functions.
- `@cosmjs/encoding`: For encoding and decoding data.
- `fs`: For file system operations.
- `dotenv`: For loading environment variables from a `.env` file.

## Usage

1. **Installation**: Install the necessary dependencies using npm:

    ```bash
    yarn add @cosmjs/cosmwasm-stargate @cosmjs/crypto @cosmjs/encoding dotenv
    ```

2. **Environment Variables**: Set up environment variables in a `.env` file in the root directory of the project:

    ```plaintext
    RPC=<Osmosis_RPC_URL>
    ```

    Replace `<Osmosis_RPC_URL>` with the actual RPC URL for the Osmosis network.

3. **Configure Contract Address**: Replace the `contractAddress` variable with the actual contract address of your deployed CosmWasm smart contract.

4. **Running the Script**: Execute the script using the following command:

    ```bash
    ts-node index.ts
    ```

    This will start the script, which will continuously monitor new blocks for transactions related to the specified contract address.

## Script Overview

- **PositionDetails Interface**: Defines the structure of position details tracked by the script.
- **Start Function**: Entry point of the script. Establishes a connection to the CosmWasm client, reads existing position details from a JSON file, and initiates block monitoring.
- **UpdatePosition Function**: Updates the position details based on the type of action performed.
- **ReadFile Function**: Reads position details from the JSON data file.
- **UpdateJson Function**: Writes updated position details to the JSON data file.
- **Continuous Block Monitoring**: The script continuously monitors new blocks for transactions related to the specified contract address. It updates position details accordingly and persists the changes to the JSON data file.

## Note

- Ensure the provided contract address is correct and corresponds to the deployed CosmWasm smart contract on the Osmosis network.
- Make sure the RPC endpoint provided in the `.env` file is accessible and properly configured.
- Customize the script as per your specific requirements, such as handling additional events or actions.
- Error handling and edge cases are essential considerations for robustness in a production environment. Ensure proper error handling is implemented as needed.

## Future Improvements

Here are some suggestions for potential improvements and enhancements to the script:

1. **Optimized Data Storage**: Explore alternative data storage solutions for storing position details, such as a relational database or a key-value store, to improve performance and scalability.

2. **Event Filtering**: Enhance event filtering capabilities to selectively track specific types of events or actions based on configurable criteria. This can help reduce processing overhead and focus on relevant transactions.

3. **Performance Optimization**: Profile and optimize the script for better performance, especially in handling large volumes of transactions and position details. Consider techniques like caching, batching, or parallel processing.

These improvements can enhance the robustness, scalability, and usability of the script, making it more effective for monitoring and managing CosmWasm smart contracts on the Osmosis network.
