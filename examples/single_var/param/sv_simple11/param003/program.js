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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t3: 2";
outputs[2] = "id6_R_t3: 512";
outputs[3] = "id6_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEFrwyAYhu/7FR5bKBg17jDYYaWUXbZBd+gxDLJDYF13SE+l/31qWiOtCTExawfvTV4/vxh9fGM+
//Sre78mdXUkqK/D5bZaV4IAmlm23++aXE5zl5JPtJkfNsnZVspqKEaU1nRKmpbnOtStOqVKbam4/iW+vc
//iXZ10aCnDXma8ldznh7I0+uCvLz9j9kavZ6jm6VWpVd1MwhvBuHNILwZ6hVxVXmuVqu7mi/N8k5Ouo44
//vZ0amejRTZ2srZO3ddrHL4+b64mqIt7XOuJwR31Qc0ANqMOhHsLteafdiKQD0mbSF2M7gC4ZUAfqsf07
//EHW74CwcdRGAegrUgXo46v2NOybo7hb2wR/3dMB/ZZ+3L9QD/+NY3N0B+q27/BDM/S7fHX64POD/02rM
//5cmwU+fh+Eu4PEC/WoUmyOWHYO53+e7wo2oD/OP7fGthJib+YjD+qOQA/x749y3WjO/9Q48E7v04EON/
//D5w/25hHwl0K/AsA/lv8GoyEfmu9p8OB+AXoZG9V
