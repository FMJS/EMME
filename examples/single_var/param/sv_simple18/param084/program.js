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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 3;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[7] = "id6_R_t2: 256;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stugkAUBuB9n2KWbWIyMofBXtJFTWO6aZvYhUtiQhcktXaBq8Z3LwgSxEOLw4Bo/505c4bLYL4w
//f5ByuYq+VpGUIgw8f+pH6lYM78JgtP0t5WIZvH/EDU9jcS++L8NA+TM/cgbxDNr8uhqInarLVnWhSmwv
//sb0uW02vNammV5pWnbhjMQ8/k7oqdBfrVFF3K+q6ou5VnDe7nrV4eHkUz69Ys/prVrp7j60We4ntJbbX
//ZXtdtlezvbrcmz7j6Xiyecg7K7y9u3jmMJldNehkgyNuUP02SNvTT7K/GHt8fnY6822WzFxfSCAABIBA
//qwg4ewjkyzxsnwDmrMYwKO2BBtAAGtp7P8iX0+mSBgINoAE0HJ2GvReDrmBQ7ANvzkJxK+EABaAAFI6T
//J9DeYL7gqkGaUKpnxwQMgAEwnELGYIOF2gmDMRa7mwtwAS7AxVFyB7tcELgAF+DiXLMIMyyMkggr25CR
//dw0qQAWo6MsXD/nCkr2EQoMG0AAaTvs7iMNhMM0otOGmA2AADIDRm68jmoBBAANgAIz/9M1EHS5s5BSm
//m5EbUAEqQEWHOUUhubSZUrgsF2ABLICF/mcUVlH4K6FoSkV5uwEsgAWw6C6faAkLAhbAAlicVTbRkIpD
//kon6UPwAGpliiA==
