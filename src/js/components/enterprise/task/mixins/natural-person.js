import api from '../../../../api';
import enterpriseURL from '../../../../api/url/enterprise';
import helpers from '../../../../extends/helpers';

export default {
    methods: {
        searchNaturalPerson(query) {
            return new Promise((resolve, reject) => {
                api.enterprise().get(helpers.convertURL(enterpriseURL.natural_person_list), {
                    keyword: query,
                    with_bank_card: 1
                }, {useLoading: false}).then((response) => {
                    this.naturalPersons = response.data;
                    resolve();
                });
            });
        },
        handlerChangeFunc(naturalPerson) {
            this.task.handler_object_uuid = '';
            this.task.handler_object_name = '';
            this.task.handler_object_phone = '';
            this.task.handler_object_certificate_number = '';

            this.naturalPersonBankCards = [];
            this.bankCardChangeFunc('');
            if (_.isObject(naturalPerson)) {
                this.task.handler_object_uuid = naturalPerson.user_uuid;
                this.task.handler_object_name = naturalPerson.user_name;
                this.task.handler_object_phone = naturalPerson.user_phone;
                this.task.handler_object_certificate_number = naturalPerson.id_card_number;

                this.naturalPersonBankCards = naturalPerson.natural_person_bank_cards;
                if (this.naturalPersonBankCards.length) {
                    // 默认选择第一张银行卡
                    this.bankCardChangeFunc(this.naturalPersonBankCards[0]);
                }
            } else {
                // 清空自然人搜索列表
                this.naturalPersons = [];
            }
        },
        bankCardChangeFunc(naturalPersonBankCard) {
            this.task.handler_object_bank_name = '';
            this.task.handler_object_card_number = '';
            if (_.isObject(naturalPersonBankCard)) {
                this.task.handler_object_bank_name = naturalPersonBankCard.bank_name;
                this.task.handler_object_card_number = naturalPersonBankCard.card_number;
            }
        },
    }
}