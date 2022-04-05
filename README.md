# StreamDeck Plugin for OctoPrint (fixed 2.0)

shows your 3D-Printer completion state in percent on your StreamDeck ([OctoPrint](https://github.com/OctoPrint/OctoPrint) required)

This plugin is based on https://github.com/cpeuschel/streamdeck-octodeck plugin but has been basically rewritten to support graphical elements, new features, and several bug fixes.

## Changes compared to original repository:
- **New feature**: "Heating/Cooling" text shown when printer is heating up or cooling down. Also up/down arrow is shown next to temperatures to indicate this.
- **New feature**: All elements are now graphical meaning that different text sizes and colors could be used when displaying the status.
- **New feature**: Printed filename shown
- **New feature**: Temperatures are shown on button(s).
- **New feature**: Added 10 second option as I felt 30sec wasn't fast enough.
- **Bug fixed**: Now supports multible instances of the tile if you are controlling multible octoprints.
- **Bug fixed**: Buttons information didn't always update. Fixed it and now they should always update when visible on Stream Deck.

## Examples how it looks

 ![Printer is offline](readme/example_printer_off.png) Printer is offline
 
 ![Printer is on](readme/example_on_preheated.png) Printer is on
 
 ![Printer is heating](readme/example_on_heating.png) Printer is heating
 
 ![Printer is printing](readme/example_prgress_bar_0.png) Printer is printing. Progress % and remaining print time shown.

## Installation
Download the latest release. Double click on the file `com.cpeuschel.octodeck.streamDeckPlugin` to install.

## Configuration (Saved automatically)
1. Add your OctoPrint Url e.g `http://192.168.178.13`
2. Add your API-Key [click](https://docs.octoprint.org/en/master/api/general.html#authorization)
3. Choose your update interval
4. Choose your favourite background color

    ![configuration.png](readme/configuration.png)

## Use
Click the icon on your StreamDeck to update the completion. Automatic update time which you are using in the configuration

## Available States
- `On` => the printer is connected and is ready to print
- `Off` => the printer is not connected with OctoPrint
- `Cancel` => print is canceling
- `20 %, 210°C, 50°C` Completion in percent, hotend temperature and bed temperature.
