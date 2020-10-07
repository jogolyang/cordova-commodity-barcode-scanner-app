/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var props = [
    {
        key: 'code', number: 1
    },
    {
        key: 'name', number: 2
    },
    {
        key: 'price', number: 3
    },
    {
        key: 'prop1', number: 4
    },
    {
        key: 'prop2', number: 5
    },
    {
        key: 'prop3', number: 6
    }
];
var form;
function queryRecord (code) {
    if (!code || !form) return
    var storage = JSON.parse(localStorage.getItem('code-scan-storage') || '{}')
    var data = storage[code]
    if (!data) return
    props.map(item => {
        form.querySelector(`[name=${item.key}]`).value = data[item.number]
    })
}
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        form = document.querySelector('.form');
        form.querySelector('[name=code]').addEventListener('focus', this.scan)
        form.querySelector('.scan').addEventListener('click', this.scan)
        document.querySelector('.save').addEventListener('click', this.save)
    },
    scan: function () {
        cordova.plugins.barcodeScanner.scan(result => {
            form.reset()
            var code = result.text
            form.querySelector('[name=code]').value = code
            queryRecord(code)
        }, error => {
            alert(error.message)
        }, {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: false, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            prompt: '请将扫描框对准条码或二维码', // Android
            resultDisplayDuration: 200, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            // orientation: 'landscape', // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS
        })
    },
    save: function () {
        var data = {}
        var codeIndex;
        props.map(item => {
            if (item.key === 'code') codeIndex = item.number
            data[item.number] = form.querySelector(`[name=${item.key}]`).value
        })
        if (!data[codeIndex]) {
            return
        }
        console.info(data)
        var storage = JSON.parse(localStorage.getItem('code-scan-storage') || '{}')
        storage[data[codeIndex]] = data
        localStorage.setItem('code-scan-storage', JSON.stringify(storage))
        form.reset()
        alert('保存成功！')
    }
};

app.initialize();