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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm01Pg0AQhu/+Co6aNKGwQBONBxvTeFGTevDYmOCBxFoP7cn434VC6dpuWynM0o/ntpndGT4WnrzM
//MK47mU2/ZlPXdZI4Gg1HU3XtdG+SuLcYu+54Er9/pAse+s6t832ZxP7odTT1OqmHmo+uOk5qDbKxn1nD
//+Si35jEzax4xt3rpivFb8pnZfS2Gblcb7IEWXbeHG+zRhuMW5/Pj3D3dO4/Pp3htc/vyivToS2totEbG
//CHpcZYyrjHGVMa4yxl3e68ho1deGxrXh6tp8j4f9wXyT/+zc4q6lnt3Me9Okt23S3zapisneNs+e2bM4
//8UHxcBrjm71zz5fXwrPKC3HhmqDgAwWgcH5QqP/eLyfLje/KI8Fw1Mqg2A6E0AMJIAGdUAsJ5QZ7NpGg
//xJAQgASQcH5IqCsE2gaC/rDJY4L8ApBAN9QiSHlLrGJC34gmgcCHBEBANdRQDe3gwKwapCCBagASqIYK
//2cl1gpQX79vERIhqAAgAwUpFopJqaAcHZtUgBQmqFGAC3bBHIaJtTCjLmKByASbOEBP1ihOHqSXsooO8
//BOBAX1QuWLSNjsD4aJKrABJAoh11cXCI2F3fQF0ADsBxIr0Y65MadvbvxFixFzF392egJAACQGivD6MJ
//HPy7C2M3JKhvAASA0GYXRrNAUGJAoJIBEPibUrwHQ04fyEOCrAKIQDNY6MBoFhI7fq3eGwd8QoADFIN4
///4UNxSCFCBQDiEAxWOi+aBYSIYoBHICDY+29sKEYpBBBZQJIoBksdF7I1SVsQIJqBZDgz0jhvgvbtQp5
//cJCPABtoC/GuC7n6BTkKEAEijr7nwnZNo0ls/AK/UQZ0
