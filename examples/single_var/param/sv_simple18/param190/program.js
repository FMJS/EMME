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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 771;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 771;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznE0tHTRUEI3bSFdZCkFuxCapguzKnn3ajSi5tiaGW+LfydnzngZ5UN+
//RsrdPv7ex1KKKPSCdRCrWzG/i0L/dCzldhd+fCYNT0txL36uo1AFmyB2ZskMOh7dzESl6rJVXaoS20ts
//r8tWs3tNq9mdZlUn6di+R19pXZW6y3VqqLsNdd1Q9xqum9/PQTy8PIrnV6xZ+zWrPb3HVsu9xPYS2+uy
//vS7bq9leXe/N3vF6uTq+5MoKn54umTlPZzcNOvmgzw2qvwbpdPlV/omx5+dnZzPfNunMw5XkECAgAASA
//QFcIOGcIFMs8758A5qrGMPjeAjSABtDQ3/9BsZzOkDSQPQ2+AxpAA2iwouHsx2AoGBT7wu1ZKOcJCigA
//BaAwTp5AZ4PFgiuLNKFWz895YcYAGAADYBglY+iChdYJgzEW1dwBXIALcDFK7tAtF9QXF5UsAlyAC3Ax
//QhZhhoVREmFMRSWf0B6oABWgYio7HoqFpe4SCm2WUIAG0AAaprIP4nIYTDMKbZpRAAyAATCmsjvCBgzq
//C4xqSgEwAAbAmMaeiTZcdJFTaMOcYgEqQAWoGDCnKCWXXaYULsuFaUYBFsACWBguo+gUhf8SClsq6vkE
//sAAWwGK4fKInLKgfLGrZBLAAFsBiqGzCkopLkon2UPwCGc5ihA==
