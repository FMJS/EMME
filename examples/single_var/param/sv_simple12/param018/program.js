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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      var x = new Float32Array(data.x_sab); x[2] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 0.0000;id7_R_t3: 1.0000";
outputs[4] = "id6_R_t3: 0.0078;id7_R_t3: 1.0000";
outputs[5] = "id6_R_t3: 0.1250;id7_R_t3: 1.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAQhnd+RUaQKtLEsY1ADFSoYgGkMjBWSGWoBJShnRD/nXzRuO3ZobRJ7PjtFN3FLzm7ebiz
//e2G4WC0/V8swDOYzMZ1Ml+wyGJ4P08/VfCY3DGH4vpi9vqW33o2C6+DrdD6Lp8/TZTRIx7L86mwQpNYk
//u44zK8+vCmuhnlkL2cIapXe8v8w/MnusaKh2prEnirpq5xq70Pzd8nm+g5uH2+D+sY+xbT17TEZExylI
//BVWXk7qc1OWkLid1q1lVdSurqivJe+X2vcUaT0bjfJE31H5nLR05zEbrnJHJGZuczORMTE5ucgqTU5ZO
//aYpTmuKUpjglHWc5zePyVSKfjB5djHx6Lkfu8/qehIAZYAaYtQOzhnlFTBezGWWiZsn+AjiADCADyKzK
//ynZZtQ4v0bu43iXdgBhrEGLyAhADxHyC2HrcUJ/dRHpXXJ8THY1Pwhl07bNwyL4ALoDLxuxLtMg26V4B
//CbABbACbB2Xl+iuQ6F1c73IEbeoX/bgQi2IOiAFiKCsbKisP5JNwBl30wjUHLmRfABeyr07LSj9yr/bB
//ho1+gA1ga7Gs3Gtf/y/Uc/C0EmgD2oC2npxh9n2frH7hgDPgDDhzMVPjLRKvNyebHey4RV7gLrdXEfkC
//wSoiVb2yctIqTHOWWxmpy0hdRuoyUvd/IDbCFS1Pu7mr1OeuUp+7Sorke7c6xer/ptpGp91XFlgD1oA1
//ND9ZALW6picadUAakAakOZWptdAGZRXOWEM429hnA86AM09x1teGqE4g9o/tUmRkQBgQZnlG1m1rlLXl
//JRAHxAFxXhadR//xh1WQo088D8XZVmMUcAacoejsVbuURUVnMwhDRgaEAWE+NE45UHQ2hTgcDQBxQJwP
//LVTWnnQCcoAcINfb88++7qcd3lUAsAFsAJsb2Vu3bVWOnYoeC3w/AgC2CQ==
