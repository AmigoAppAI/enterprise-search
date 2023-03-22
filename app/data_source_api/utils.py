import importlib
import logging
import concurrent.futures

logger = logging.getLogger(__name__)


def _snake_case_to_pascal_case(snake_case_string: str):
    """Converts a snake case string to a PascalCase string"""
    components = snake_case_string.split('_')
    return "".join(x.title() for x in components)


def get_class_by_data_source_name(data_source_name: str):
    class_name = f"{_snake_case_to_pascal_case(data_source_name)}DataSource"

    module = importlib.import_module(f"data_sources.{data_source_name}")

    try:
        return getattr(module, class_name)
    except AttributeError:
        raise AttributeError(f"Class {class_name} not found in module {module},"
                             f"make sure you named the class correctly (it should be <Platform>DataSource)")


def parse_with_workers(method_name: callable, items: list, **kwargs):
    workers = 10  # should be a config value

    logger.info(f'Parsing {len(items)} documents (with {workers} workers)...')

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = []
        for i in range(workers):
            futures.append(executor.submit(method_name, items[i::workers], **kwargs))
        concurrent.futures.wait(futures)
        for w in futures:
            e = w.exception()
            if e:
                logging.exception("Worker failed", exc_info=e)
