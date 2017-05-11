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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 1";
outputs[2] = "id6_R_t3: 256";
outputs[3] = "id6_R_t3: 257";
outputs[4] = "id6_R_t3: 65536";
outputs[5] = "id6_R_t3: 65537";
outputs[6] = "id6_R_t3: 65792";
outputs[7] = "id6_R_t3: 65793";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmMFrwjAYxe/7K3JUENLmM5UNdpgM2WUbuIPHMugOhTl3qKfh/74k1TZoWpo2bgrvFl6SzzT5vRcM
//55tt8b0tOGd5lqTLtKA7FnG+3mQfn0p8mrN79jPKM5Gu0iKeqFFkWuMJU+pUt4VWpWmVaqza6/f8S+vC
//Gm3r1KBPG+o01S/XPN6xh5dH9vx6Has1er1Gu0qtSqdqVyBnBXJWIGeFekdsVR6r5e4u5wuzvaODrkcc
//vk7NjPTsps64rVO0dVY/v9gfrmNUOeJtpUfsbrgL6hhQA2p/qIdwe9xZHUTUAWmz6JO5HUAXMgHqQD1w
//fnuiXm147I86eaA+A+pA3R/1/sEdEnT7CPvhj6QH/v+c9NUH9TDAfi6SHqhfftIPAd2d9N3xT6QkZD0M
//8KevMqfuqJYu/C0gvWBH2gP20K81Xmk/BHV32vsYYHYrYAAYIHDatz7ThDQABTAAwQAwgL8B+j7enD//
//CbcCTHEVt4L1TzekLeytwK0AA1zqrXAm/FvfgDqY4hf/4XSJ
