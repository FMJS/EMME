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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmehzTtHTRUEI3bSFdZCkBuxCapguzKnn3arxgzLE14xgn8O/kzBkvo3zI
//z0i52cbf21hKEYV+sAhi906M76NwUhxLud6EH59Jw/NMPIif6yh0g2UQO6NkBu2PbkbioOqxVVWpEttL
//bK/HVrN7TavZnWZVJ+lYr6KvtO5Wuqt1aqh7DXXVUPcbrpvfz048vj6JlzesWfs1qz29z1arvcT2Etvr
//sb0e26vYXlXvzd7xYjbfv+SDFS6eLpk5Tmc3DTr54IQbdP8apOLy8/wTY8/Pz85mvi/TmbsrySHgAAEg
//AARMIeAcIVAu87h/ApirasMw8W9BA2gADf39H5TL6ZyTBjJAwxQ0gAbQ0ImGox+Dc8Hgsi+8OwvIE4AC
//ULAgT6CjwXLB3Q5pQq2enxMZA2AADJeQMZhgoXXCoI0FcgdwAS4syB3MckG9cYEsAlyAi4GzCD0stJII
//bSqq+UTylwEqQAWosGXHQ7mwZC6hUFoJBWgADaDBmn0Qp8Ogm1EozYwCYAAMgGHN7oguYFBvYEwBBsAA
//GPbtmWjDhYmcQiGnABWg4gJyikpyaTKl8FgukFGABbBgf0ZhFIX/EoquVCCfABbAYrh8oicsqCcskE0A
//C2AxTDbRkYpTkon2UPwCEbViyA==
