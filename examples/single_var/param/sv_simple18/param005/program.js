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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtms1qg0AUhfd9ilm2EBidOxpo6aKhhG7aQrrIUgp2ITRNF2ZV8u7V+IPRa2t0jBrOTs7cccY78nE4
//jJTbXfi9C6UUge96Ky9Ut8K6C/x59izlZut/fEYFTwtxL36uA195ay+0Z9EMOjzdzMSRqlnVKajE1hJb
//q1k12WusJjtNVDuq2LwHX7GuCtVFnWp0XaM7Nbpbs266n714eHkUz6/oWfOelb7eZdViLbG1xNZqtlaz
//tQ5b65RrkzNeLZaHQz7qcPZ10Uwrnl03aKeDc25Q/TVI2fLL9Bdj38/PTma+reOZ+yvJQcAGBAABQMAU
//BOwKBPI2W/0jgFm1NRjgDgAGgKFHd5C30z4nGKgzGOAYAAaAoRsYKqbgXFhQ7IET3AKgAChcQpZAlcG8
//4apDklDS03fCLQAMAMMU8gUTWGicLrSGBVwEYAFYDJ45mIUF9QQLOAvAArAYOIdoh4pWKQRcBUABUFzW
//PYe8sWQum3DgIAAGgGHKdx9Ox0LbbMKBiwAsAIsp34foAgvqCRZwFoAFYDG6OxJNUGEim4CrACgAivFn
//E4Ws0mQyoVlYwD0ACoDC2HMJo0j4L5XoCgq4B4ACoBgmk+gJFNQLKOAoAAqAYog8oiMmTkkjmkPiF96d
//W3g=
