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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
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
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[2] = "id2_R_t1: 0;id5_R_t2: 256";
outputs[3] = "id2_R_t1: 0;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9LwzAYxu9+ihwVCmm6rAHFg0OGFxXmYccibIeCcx66k+y7m5r+ydKUdW1aW3lu4UneN2nS91f6
//EEr3h+TrkFBK4k0QraKE3RL/Lt7M03Yg25Tu9pvthxzwtCD35Ps6H+fJiFm0lq0bj5yoXFPVCFNV2VM1
//TNXAVIWmqhGmymR79x5/esW6q7q+Ol3nNbqav6qHNfNm6zmSh5dH8vyK3bHtjvH0epZSDa1j9QzlTukZ
//SjW0jtUzcGsGbs3AzQzqjFeL5e8hn6wyf2YZ6afRdZ0s6yzP0RJp7WT59MvKK6aNskeryLd1Gnm8oih3
//lDvK3VG5s0q5F0n9/ovdvp1AABAABPzhF79YABsSAQIIAAKAgMEQUPnQDwWA85vWvfwZyh/lj/Lv+5+/
//2lkcj9/hj9/Qs5xAABAABIzLB3ABgMYuALAALAALU/AG3GJBAAvAArAwdb+gHRRauQVOkBDMQ0ABUAAU
//hr85UBwDc+cicEAAEAAEpnKf4HIEtPURAAaAAWCYzC2DLmAQAAPAADD8x7sHTbDgwktoCwUBKAAKgEIv
//XoLmI7p0EmbWVwkAAAAAgDH5CE7L/5yLACgACoDC+D2EnqAgAAVAAVCYpH/QEQmXuAfNgfADNb33jQ==
