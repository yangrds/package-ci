

const exec = require('child_process').exec;
const os = require('os');




export default function ():any {
	return new Promise((resolve) => {
		let drives = [];
		switch (os.platform().toLowerCase()) {
			case 'win32':
				exec(
					'wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list',
					function (err, stdout, stderr) {
						if (err) resolve(null)
						let aLines = stdout.split('\r\r\n');
						let bNew = false;
						let sCaption = ''
						let sDescription = ''
						let sFreeSpace: any = ''
						let sSize: any = ''
						let sVolume = '';
						for (let i = 0; i < aLines.length; i++) {
							if (aLines[i] != '') {
								let aTokens = aLines[i].split('=');
								switch (aTokens[0]) {
									case 'Caption':
										sCaption = aTokens[1];
										bNew = true;
										break;
									case 'Description':
										sDescription = aTokens[1];
										break;
									case 'FreeSpace':
										sFreeSpace = aTokens[1];
										break;
									case 'Size':
										sSize = aTokens[1];
										break;
									case 'VolumeSerialNumber':
										sVolume = aTokens[1];
										break;
								}

							} else {
								if (bNew) {
									sSize = parseFloat(sSize);
									if (isNaN(sSize)) {
										sSize = 0;
									}
									sFreeSpace = parseFloat(sFreeSpace);
									if (isNaN(sFreeSpace)) {
										sFreeSpace = 0;
									}

									let sUsed: any = (sSize - sFreeSpace);
									let sPercent = '0%';
									if (sSize != '' && parseFloat(sSize) > 0) {
										sPercent = Math.round((parseFloat(sUsed) / parseFloat(sSize)) * 100) + '%';
									}
									drives[drives.length] = {
										filesystem: sDescription,
										blocks: sSize,
										used: sUsed,
										available: sFreeSpace,
										capacity: sPercent,
										mounted: sCaption
									};
									bNew = false;
									sCaption = ''; sDescription = ''; sFreeSpace = ''; sSize = ''; sVolume = '';
								}

							}
						}
						resolve(drives)
					}
				);

				break;

			case 'linux':
			// Linux 
			default:
				exec(
					'df -P -g | awk \'NR > 1\'',
					function (err, stdout, stderr) {
						if (err) return resolve(null)
						let aLines = stdout.split('\n');
						for (let i = 0; i < aLines.length; i++) {
							let sLine = aLines[i];
							if (sLine != '') {
								sLine = sLine.replace(/ +(?= )/g, '');
								let aTokens = sLine.split(' ');
								drives[drives.length] = {
									filesystem: aTokens[0],
									blocks: aTokens[1],
									used: aTokens[2],
									available: aTokens[3],
									capacity: aTokens[4],
									mounted: aTokens[5]
								};

							}
						}
						resolve(drives)
					}
				);

		}
	})



}