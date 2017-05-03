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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 < 0) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id8_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlsFrgzAYxe/9K3JsoZDGJFI6emjZZIdthfbQo5RlB2GtO9jT2P8+NVpS+QTRCD28W3i+p/GLP3yc
//p9fs55pxzhITxvs4C1Zs8ZSYZb3m/Jyar+/c8Lpla/Y7TUwQH+NMzPOELFezObtTFalqR5WkV5JeRap2
//r4Vqd2pVkTvOp+RS6IHjdnXZoqsWXbfoYctzq/38sc3HM3vfYWbdZ9Z4+5BUXa8kvZL0KtKrSK8mvbrp
//tWe830blId9NuH67PLko0tM61Lgo6ptE1YdC3oJO2+ThWCTtuhzrZ3ox62jzdniZTTj4Bt/g2z/ft0n2
//pds9Co9sC7ANtsH2ILbVULbVOGzjvw22wfaIvfw2zh6tvMqCbbANth+uk3chm27kA7lGHwfX4Hq0Pt6F
//azUG1+7/WoBrcA2u/XZxPaCLa7ANtsH2g3Zx3buLa39dHFyDa3DttYvr3l28M9f/QEkv5w==
