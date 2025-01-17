use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result, ToResult, Zip};
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::address::{Address, ByronAddress};
use cardano_serialization_lib::crypto::{Ed25519KeyHash, ScriptHash};
use cardano_serialization_lib::fees::LinearFee;
use cardano_serialization_lib::metadata::AuxiliaryData;
use cardano_serialization_lib::tx_builder::TransactionBuilder;
use cardano_serialization_lib::utils::{BigNum, Coin, Value};
use cardano_serialization_lib::{Certificates, TransactionInput, TransactionOutput, Withdrawals};
use jni::objects::JObject;
use jni::sys::{jboolean, jlong, jobject};
use jni::JNIEnv;
use std::convert::TryFrom;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddKeyInput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, hash: JRPtr, input: JRPtr, amount: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let hash = hash.rptr(&env)?;
    let input = input.rptr(&env)?;
    let amount = amount.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(hash.typed_ref::<Ed25519KeyHash>())
      .zip(input.typed_ref::<TransactionInput>())
      .zip(amount.typed_ref::<Value>())
      .map(|(((tx_builder, hash), input), amount)| tx_builder.add_key_input(hash, input, amount))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddScriptInput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, hash: JRPtr, input: JRPtr, amount: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let hash = hash.rptr(&env)?;
    let input = input.rptr(&env)?;
    let amount = amount.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(hash.typed_ref::<ScriptHash>())
      .zip(input.typed_ref::<TransactionInput>())
      .zip(amount.typed_ref::<Value>())
      .map(|(((tx_builder, hash), input), amount)| tx_builder.add_script_input(hash, input, amount))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddBootstrapInput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, hash: JRPtr, input: JRPtr, amount: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let hash = hash.rptr(&env)?;
    let input = input.rptr(&env)?;
    let amount = amount.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(hash.typed_ref::<ByronAddress>())
      .zip(input.typed_ref::<TransactionInput>())
      .zip(amount.typed_ref::<Value>())
      .map(|(((tx_builder, hash), input), amount)| {
        tx_builder.add_bootstrap_input(hash, input, amount)
      })
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddInput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, address: JRPtr, input: JRPtr, amount: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let address = address.rptr(&env)?;
    let input = input.rptr(&env)?;
    let amount = amount.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(address.typed_ref::<Address>())
      .zip(input.typed_ref::<TransactionInput>())
      .zip(amount.typed_ref::<Value>())
      .map(|(((tx_builder, address), input), amount)| tx_builder.add_input(address, input, amount))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderFeeForInput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, address: JRPtr, input: JRPtr, amount: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let address = address.rptr(&env)?;
    let input = input.rptr(&env)?;
    let amount = amount.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(address.typed_ref::<Address>())
      .zip(input.typed_ref::<TransactionInput>())
      .zip(amount.typed_ref::<Value>())
      .and_then(|(((tx_builder, address), input), amount)| {
        tx_builder.fee_for_input(address, input, amount).into_result()
      })
      .and_then(|fee| fee.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddOutput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, output: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let output = output.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(output.typed_ref::<TransactionOutput>())
      .map(|(tx_builder, output)| tx_builder.add_output(output))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderFeeForOutput(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, output: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let output = output.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(output.typed_ref::<TransactionOutput>())
      .and_then(|(tx_builder, output)| tx_builder.fee_for_output(output).into_result())
      .and_then(|fee| fee.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetFee(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, fee: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let fee = fee.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(fee.typed_ref::<Coin>())
      .map(|(tx_builder, fee)| tx_builder.set_fee(fee))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetTtl(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, ttl: jlong,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let ttl_u32 = u32::try_from(ttl).map_err(|err| err.to_string())?;
    tx_builder.typed_ref::<TransactionBuilder>().map(|tx_builder| tx_builder.set_ttl(ttl_u32))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetValidityStartInterval(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, vsi: jlong,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let vsi_u32 = u32::try_from(vsi).map_err(|err| err.to_string())?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .map(|tx_builder| tx_builder.set_validity_start_interval(vsi_u32))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetCerts(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, certs: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let certs = certs.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(certs.typed_ref::<Certificates>())
      .map(|(tx_builder, certs)| tx_builder.set_certs(certs))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetWithdrawals(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, withdrawals: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let withdrawals = withdrawals.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(withdrawals.typed_ref::<Withdrawals>())
      .map(|(tx_builder, withdrawals)| tx_builder.set_withdrawals(withdrawals))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderSetAuxiliaryData(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, auxiliary_data: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let auxiliary_data = auxiliary_data.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(auxiliary_data.typed_ref::<AuxiliaryData>())
      .map(|(tx_builder, auxiliary_data)| tx_builder.set_auxiliary_data(auxiliary_data))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderNew(
  env: JNIEnv, _: JObject, linear_fee: JRPtr, minimum_utxo_val: JRPtr, pool_deposit: JRPtr,
  key_deposit: JRPtr, max_value_size: jlong, max_tx_size: jlong,
) -> jobject {
  handle_exception_result(|| {
    // let linear_fee = linear_fee.rptr(&env)?;
    // let minimum_utxo_val = minimum_utxo_val.rptr(&env)?;
    // let pool_deposit = pool_deposit.rptr(&env)?;
    // let key_deposit = key_deposit.rptr(&env)?;
    // let max_value_size_u32 = u32::try_from(max_value_size).map_err(|err| err.to_string())?;
    // let max_tx_size_u32 = u32::try_from(max_tx_size).map_err(|err| err.to_string())?;
    // linear_fee
    //   .typed_ref::<LinearFee>()
    //   .zip(minimum_utxo_val.typed_ref::<Coin>())
    //   .zip(pool_deposit.typed_ref::<BigNum>())
    //   .zip(key_deposit.typed_ref::<BigNum>())
    //   .map(|(((linear_fee, minimum_utxo_val), pool_deposit), key_deposit)| {
    //     TransactionBuilder::new(
    //       linear_fee,
    //       minimum_utxo_val,
    //       pool_deposit,
    //       key_deposit,
    //       max_value_size_u32,
    //       max_tx_size_u32,
    //     )
    //   })
    //   .and_then(|tx_builder| tx_builder.rptr().jptr(&env))
    Ok(JObject::null())
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderGetExplicitInput(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.get_explicit_input().into_result())
      .and_then(|amount| amount.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderGetImplicitInput(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.get_implicit_input().into_result())
      .and_then(|amount| amount.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderGetExplicitOutput(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.get_explicit_output().into_result())
      .and_then(|amount| amount.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderGetDeposit(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.get_deposit().into_result())
      .and_then(|amount| amount.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderGetFeeIfSet(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.get_fee_if_set().rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderAddChangeIfNeeded(
  env: JNIEnv, _: JObject, tx_builder: JRPtr, address: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_builder = tx_builder.rptr(&env)?;
    let address = address.rptr(&env)?;
    tx_builder
      .typed_ref::<TransactionBuilder>()
      .zip(address.typed_ref::<Address>())
      .and_then(|(tx_builder, address)| (tx_builder.add_change_if_needed(address)).into_result())
      .and_then(|val| (val as jboolean).jobject(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderBuild(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.build().into_result())
      .and_then(|tx_body| tx_body.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionBuilderMinFee(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<TransactionBuilder>()
      .and_then(|tx_builder| tx_builder.min_fee().into_result())
      .and_then(|fee| fee.rptr().jptr(&env))
  })
  .jresult(&env)
}
