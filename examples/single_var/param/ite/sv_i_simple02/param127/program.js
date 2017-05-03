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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 < 2) {
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
outputs[0] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 1;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljtrwzAUhff+Co0JBGS9rNKSIaE1HfoApyGjKXUHQxN3cKbS/14/U8Vc1XYsSIa7iaNz7esrfRxT
//mu6zr31GKUliPwqjjN8QfpvE1/Xao3Sbxh+fueFhSebke5LEPNpEGZvlFaJcTWfkSJWgqgxVgF4BeiWo
//Vr0WatVppbLcsX1LdoXODbepC4suLbqy6L7lvXU/P2TxfEeeXnBm/WfW+nofVE2vAL0C9ErQK0GvAr2q
//7a3OOFwG5SEfTfgwGa+onTQlxVbz4fkGax4R1NcEeABcW9WtNkVdtS5H+p7u4nmweFzdT69oF9sM2Ua2
//kW2XbB+GOZjsutIF1xy5Rq6Ra5dcq5O5VuO49nKu9YX/i5/rNv6NXlvuqL5Yrs81M95Bn99JH8xZ77No
//daHBLjTYhQa70J1cGz/cDdka3rSybbjg6v/4fg3XNrwZ4o14I96j8Obt2B4Kt3lA7tA2k5sh2og2ou02
//uQ3uB+c27/4r75naiDaijWg7Te0+YMOZPQ5rM7E5Yo1YI9ZuE1uOSGzpLLERbUQb0Xaa2PLkxO6L9S8W
//BS6h
