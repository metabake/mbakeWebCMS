// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

export class SysAgent { // agent
    static si = require('systeminformation')

    static os = require('os')

    async ping() { // often like 1 second
        console.log('ping')

        const track =  new Object() 
        
        await SysAgent.si.services('node, pm2, mysql, caddy').then(data => console.log(data))

        await SysAgent.si.fsStats().then(data => console.log(data.rx, data.wx))

        await SysAgent.si.disksIO().then(data => console.log(data.rIO, data.wIO))

        await SysAgent.si.fsOpenFiles().then(data => console.log(data.max, data.allocated))

        await  SysAgent.si.networkInterfaceDefault().then(data => console.log(data))
        await SysAgent.si.networkStats('en0').then( function(data){ 
            const dat = data[0]
            console.log(dat.rx_bytes, dat.tx_bytes)
        })

        await SysAgent.si.mem().then(data => 
            console.log(data.free, data.used, data.swapused, data.swapfree)
        )

        await SysAgent.si.currentLoad().then(data => console.log(data.avgload))

        await console.log(SysAgent.os.hostname() )

        await console.log(track)

    }//()

    info() { // rare, like day
        console.log('info')

        SysAgent.si.networkConnections().then(data => console.log(data))

        SysAgent.si.processes().then(data => console.log(data))

        SysAgent.si.networkInterfaces().then(data => console.log(data))

        SysAgent.si.fsSize().then(data => console.log(data))

        SysAgent.si.blockDevices().then(data => console.log(data))

        SysAgent.si.osInfo().then(data => console.log(data))

        SysAgent.si.users().then(data => console.log(data))

    }//()

}//class

// network. geocode. ip. volume free, ports, who

// https://www.npmjs.com/package/portscanner

// https://github.com/ddsol/speedtest.net#readme

// https://www.npmjs.com/package/pcap

//https://www.npmjs.com/package/ip

// https://www.npmjs.com/package/local-devices

// https://millermedeiros.github.io/mdoc/examples/node_api/doc/os.html

// has

//