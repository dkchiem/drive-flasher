# drive-flasher

**drive-flasher** is a cli to flash an OS on a removable drive. It is designed to be simple to use on your mac.

## Installation

> You may need to use `sudo` to install the package globally. This CLI will only work on _macOS_.

```bash
$ npm i -g drive-flasher
```

After installing the cli, you are ready to use it.

## Usage

> The cli has been tested on _macOS Catalina_ with a _Ubuntu_ ISO image.

In order to flash an OS on your drive, the following command will ask you these questions:

- Which removable drive do you want to use?
- What's the path to your image file?

It will then do its work to flash the OS on the drive. Note that it will also wipe everything on the drive.

Command:

```bash
$ drive-flasher
```

## Author

- **Vu Dang Khoa Chiem** - Doudou8

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
