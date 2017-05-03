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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+2;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 512;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 3";
outputs[3] = "id4_R_t2_0: 512;id4_R_t2_1: 3";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 1024";
outputs[5] = "id4_R_t2_0: 512;id4_R_t2_1: 1024";
outputs[6] = "id4_R_t2_0: 0;id4_R_t2_1: 1027";
outputs[7] = "id4_R_t2_0: 512;id4_R_t2_1: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rwjAYx/H7XkWOE4Q0qWOwscNkyC7bwB08loE7CHPuUE/D9776p860T0Rto1i/N+3jk7ZJ+dD8
//UOvJNP2Zplqr0bCT9JPUJtGdiu7X30z2TevxZPj5lf3ouase1O/1aGiTQZKadtYVLz4lUautpOPGc9wu
//j+fd5Q6h4vYIo+V30P6/m9VoJvvd+GP0Pa8sr6V83L0ToeLvseVKfi3eimnN1OPrk3p5Y07rm9PCzLgd
//pePCvLgdQsWUZ0zs8Z/Henus8Hz0u73FA1JYi/zus/7FGP6yccumULbby3F+Gb3VY+o5i2+EZff7YN49
//u9KAAziAc+bgGAGc9YJER+YmKj4OhzN0YywQAREQnfObz8bEm1NQ5C48GIERGDUXI99rzxEpEt59aoXI
//3ZzFMARDMNTUNCgWyhuLYyumQaXKemwogiIoIicKBtFuOVFFoIqbNoiCKIhqbIIUBqkdNm4wBVMwRbYU
//GqkK2VKtWz0T2Q5GYRRGXdLfkDaWIA4UPFk0QiM0InsKalG17MketqlDKZRCqUv7A1N1pyrs7ZAKqZCK
//BKpGpwIkUIfu+W4xCqMwqlEJlBOEh0ig3OVFIzRCIxIoMYEKadHWBKouo4R9HUqhFEo1K4EK7pR/b4dU
//SMWckkAd06n9E6h9lfoDTxxrRg==
