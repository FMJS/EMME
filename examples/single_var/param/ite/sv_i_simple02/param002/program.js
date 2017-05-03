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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlrGLwjAYxff7KzIqCLFNUo4TB0WLw52CDo5FjENBrUOdxP/dtmkllq9Q6g0R3hZe32uTL/3B4zy5
//ppdryjmLdRCto9T/YcNRrL+rNeenRB+OmWExZWN268Xaj7ZR6g2yhChW/QF7USWpKksVpFeQXkmqZq+5
//anZqVC9znHbxOdd9y23rokGXDbpq0IOG75b7ubPJcsb+VphZ+5nVTh+Qqu0VpFeQXkl6JelVpFfVveaO
//19OwuOSXCVeny5LDPN2rQrWHXvWSsPxRyFfQaZPcbPOkWRdj3SdnPQ4nv5t5/4uDb/ANvv+f7+cku9Jt
//XwXYBttg2xm25btsS7ANtsH2x/Xy5zg7tPIyC7bBNth2rpO3IZtu5OAaXINrV/t4G64luAbX4PrDurh6
//o4srsA22wbajXVx17uLgGlyDa1e7uOrcxVtz/QD7ni/h
