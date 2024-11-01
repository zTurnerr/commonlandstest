use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result, Zip};
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::crypto::{BootstrapWitnesses, Vkeywitnesses};
use cardano_serialization_lib::TransactionWitnessSet;
use jni::objects::JObject;
use jni::sys::jobject;
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionWitnessSetNew(
  env: JNIEnv, _: JObject,
) -> jobject {
  handle_exception_result(|| TransactionWitnessSet::new().rptr().jptr(&env)).jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionWitnessSetSetVkeys(
  env: JNIEnv, _: JObject, transaction_witness_set: JRPtr, vkeywitnesses: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let transaction_witness_set = transaction_witness_set.rptr(&env)?;
    let vkeywitnesses = vkeywitnesses.rptr(&env)?;
    transaction_witness_set
      .typed_ref::<TransactionWitnessSet>()
      .zip(vkeywitnesses.typed_ref::<Vkeywitnesses>())
      .map(|(witness_set, witnesses)| witness_set.set_vkeys(witnesses))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionWitnessSetSetBootstraps(
  env: JNIEnv, _: JObject, transaction_witness_set: JRPtr, bootstrap_witnesses: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let transaction_witness_set = transaction_witness_set.rptr(&env)?;
    let bootstrap_witnesses = bootstrap_witnesses.rptr(&env)?;
    transaction_witness_set
      .typed_ref::<TransactionWitnessSet>()
      .zip(bootstrap_witnesses.typed_ref::<BootstrapWitnesses>())
      .map(|(witness_set, witnesses)| witness_set.set_bootstraps(witnesses))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}
