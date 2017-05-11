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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[1] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[7] = "id6_R_t2: 512;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMZw5DvcSFjWncqElddElMcEFirQu6Mn13oVBC6UFxGOjFf9ecOcNlaL4w
//f5BysYw/l7GUIgr9YBrE+loMb6JwtPkt5XwRvr0nDQ9jcSu+zqNQB7MgVoNkBq1/XQzEVtVjq6ZUJbaX
//2F6PrWbXmlazK82qKumYv0YfaV2Xust1qql7NXVTU/drzptfz0rcPd2Lx2esWfM1q9y9z1bLvcT2Etvr
//sb0e22vYXlPtzZ7xdDxZP+StFd7cXTJzmM6uG1T54Igb1D8N0ub0k/wvxh6fn53NfJmlM1dnEggAASDQ
//KQJqB4FimYfdE8Cc1RoGozRoAA2gobv3g2I5VZ80EGgADaBh7zTsvBj0BYNmH3h7FspbCQUUgAJQ2E+e
//QDuDxYLrFmlCpZ4fEzAABsBwDBmDCxYaJwzWWGxvLsAFuAAXe8kd3HJB4AJcgItTzSLssLBKIpxsQ0b+
//JagAFaDiUL54KBaW3CUUBjSABtBw3N9B/B0G24zCWG46AAbAABgH83VEGzAIYAAMgPGfvplowoWLnMJ2
//M3IFKkAFqOgxpyglly5TCo/lAiyABbBw+BmFUxR+SyjaUlHdbgALYAEs+ssnOsKCgAWwABYnlU20pOIv
//yURzKL4BP7ZiYA==
