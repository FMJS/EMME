// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28FOwkAQgOG7T9GjJiSl3V1INB4khnhREzxwJCb10ETEA5yM7y7QggWm2Ep325L/RmZnobTwZdrJ
//+P5sMf9czH3fi6PeZDSZh9de9yaO+pvXvj+dRW/vy4SHgXfrfV3GUTgZT+ZBZ7lDrV9ddbydqBajJhNV
//Yq4Sc7UYTY51FU2ONIkGy4zpa/yxioeZ7Gxc5cR1TtzkxHs5n5sez7d393TvPT5zzoqfs71v3xOj2Vwl
//5ioxV4u5Wsw1Yq7Zz02u8WgwXF/knTO8+XbLnd3V7rzF4NhieGxRpYv9Yzv78s70wIfpj1N8f3l3svNl
//nO4s84e48CVsQrABG7CpCpvTPfld3F6grn1qhE8tDdBxaEwANVADNW7qmpLUbC9E4JIaZY0aDTVQAzVV
//UXNq4VI3NKH4E7LFD89vwAd8Glnn6Fr40Zag4YYKaICmgVWOblCVo6lywAd8zrdLdSjT9sSGLvkxVDlA
//AzSt7lCVqnLqYUaucgxdK/iBn5bXOQUaU3XzoxzzQycLfuCnMn5Oa1Y1s/ZxSxLPfQAJkOqqh3TTSNJO
//8eFmDHzAp55qSLejGtJUQ4AESMxqFZ3VOlzMcPb/Sa29ePqef89vUfkADdCc35xWFcwUntL6Gx/6XUAD
//NOc4pVUtNMoaNHS2gAZoWjujZa+esY8PT22gB3paPKFVLT7aEjPcSsEMzLR2PstFhaOpcKAHepjOsouP
//ocKBGZhhNst9hWPoVIEP+DCZ5a5P5QIfulfgAz4tncty3buyDxLPe+AIjlo7lWWvn8UzIOiBHmayGtLj
//qpKjH2NDZWA=
