async function loadCommands(client) {
    const { loadFiles } = require("../Functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Comandos", "Estados");

    await client.commands.clear();
    
    await client.commands.clear();
    await client.subCommands.clear();
    let commandsArray = [];

    const Files = await loadFiles("Comandos");

    Files.forEach((file) => {
        const command = require(file);

        if(command.subCommand)
        return client.subCommands.set(command.subCommand, command);

        client.commands.set(command.data.name, command);

        commandsArray.push(command.data.toJSON());

        table.addRow(command.data.name, "✅");
    });

    client.application.commands.set(commandsArray);

    return console.log(table.toString(), `\nComandos Cargados`.green);
}

module.exports = { loadCommands };