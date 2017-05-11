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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 == 0) {
         var x = new Int8Array(data.x_sab); x[0] = 0;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 0;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id3_R_t2: 2;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 2;id6_R_t3: 2";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[3] = "id3_R_t2: 0;id6_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlj0PgjAQhnd/RUdJTEorOmgcNEoc/EhQ40iMOJCoOOBk/O+2VKBSsBVJjNqtedv3eleeHAdhcA5P
//5xBC4HtN13FD3AG463ttum52gAnhIfB2e3JgPAA9cKnH5xrE0XLXZGU0AFERWR82/pHqmOpI1JlT1Ivi
//sCyMK+jPhmA6/9T9kc5iZqOkKh8jVfkIad68ynxCtc7Ajsp98CV1mdRbjy10K05btoni+Lbwmvyr5XiZ
//b7GmPraOXmsbHL2e3Z8sRkYNynDCGqevwwkJm5yvLEwZ/X66CsR0x/qFjpXkhqpC7B5Rd7E/QuzJVnnA
//8tU38TIlHeydD5n/3FbB57X4QhK8qrpfBowcDeUKMpF51XoBL9XBquzUVdSvlOaupbNSIQpror6QqHKD
//l5Sn10cvRcp03/oNypIbK6TMkv8eI8puu4vc2Q==
